import { Client } from "@notionhq/client";

export async function createNotionPage(
  accessToken: string,
  databaseId: string,
  title: string,
  content: string,
  format: string,
  duration: number,
  audioUrl?: string
): Promise<string> {
  const notion = new Client({ auth: accessToken });

  // Convert markdown content to Notion blocks
  const blocks = convertMarkdownToBlocks(content);

  // Add audio file if provided
  if (audioUrl) {
    blocks.push({
      type: "file",
      file: {
        type: "external",
        external: { url: audioUrl },
      },
    } as any);
  }

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [{ text: { content: title } }],
      },
      format: {
        select: { name: format },
      },
      duration: {
        number: duration,
      },
      created: {
        date: { start: new Date().toISOString() },
      },
    },
    children: blocks as any,
  });

  return `https://notion.so/${response.id.replace(/-/g, "")}`;
}

function convertMarkdownToBlocks(markdown: string): any[] {
  const lines = markdown.split("\n");
  const blocks: any[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    // Heading 2
    if (line.startsWith("## ")) {
      blocks.push({
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: line.replace("## ", "") } }],
        },
      });
    }
    // Heading 3
    else if (line.startsWith("### ")) {
      blocks.push({
        type: "heading_3",
        heading_3: {
          rich_text: [{ text: { content: line.replace("### ", "") } }],
        },
      });
    }
    // Bullet list
    else if (line.startsWith("- ")) {
      blocks.push({
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ text: { content: line.replace("- ", "") } }],
        },
      });
    }
    // Numbered list
    else if (/^\d+\. /.test(line)) {
      blocks.push({
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [{ text: { content: line.replace(/^\d+\. /, "") } }],
        },
      });
    }
    // Checkbox
    else if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
      const checked = line.startsWith("- [x] ");
      blocks.push({
        type: "to_do",
        to_do: {
          rich_text: [
            {
              text: {
                content: line.replace(/^- \[(x| )\] /, ""),
              },
            },
          ],
          checked,
        },
      });
    }
    // Paragraph
    else {
      blocks.push({
        type: "paragraph",
        paragraph: {
          rich_text: [{ text: { content: line } }],
        },
      });
    }
  }

  return blocks;
}

// OAuth helpers
export function getNotionAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.NOTION_CLIENT_ID!;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    owner: "user",
    redirect_uri: redirectUri,
  });

  if (state) {
    params.append("state", state);
  }

  return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
}

export async function exchangeNotionCode(
  code: string,
  redirectUri: string
): Promise<{ access_token: string; workspace_id: string }> {
  const auth = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Notion code");
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    workspace_id: data.workspace_id,
  };
}
