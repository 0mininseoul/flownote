// Notion API using fetch for Edge Runtime compatibility
const NOTION_VERSION = "2022-06-28";
const NOTION_API_BASE = "https://api.notion.com/v1";

function getHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export async function createNotionPage(
  accessToken: string,
  targetId: string,
  title: string,
  content: string,
  format: string,
  duration: number,
  targetType: "database" | "page" = "database"
): Promise<string> {
  // Convert markdown content to Notion blocks
  const blocks = convertMarkdownToBlocks(content);

  if (targetType === "page") {
    // 페이지 하위에 새 페이지로 생성
    const response = await fetch(`${NOTION_API_BASE}/pages`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        parent: { page_id: targetId },
        properties: {
          title: {
            title: [{ text: { content: title } }],
          },
        },
        children: blocks,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Notion API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return `https://notion.so/${data.id.replace(/-/g, "")}`;
  }

  // 데이터베이스에 새 아이템으로 생성
  // 먼저 전체 속성으로 시도하고, 실패하면 title만으로 재시도
  try {
    const response = await fetch(`${NOTION_API_BASE}/pages`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        parent: { database_id: targetId },
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
        children: blocks,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      // 속성 관련 에러인 경우 title만으로 재시도
      if (error.message && error.message.includes("is not a property")) {
        console.log("Database properties not found, retrying with title only...");
        return await createNotionPageWithTitleOnly(accessToken, targetId, title, blocks);
      }
      throw new Error(`Notion API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return `https://notion.so/${data.id.replace(/-/g, "")}`;
  } catch (error) {
    // 속성 에러가 아닌 경우 재throw
    if (error instanceof Error && error.message.includes("is not a property")) {
      console.log("Database properties not found, retrying with title only...");
      return await createNotionPageWithTitleOnly(accessToken, targetId, title, blocks);
    }
    throw error;
  }
}

// title만으로 노션 페이지 생성 (기존 데이터베이스용)
async function createNotionPageWithTitleOnly(
  accessToken: string,
  databaseId: string,
  title: string,
  blocks: any[]
): Promise<string> {
  // 먼저 데이터베이스의 title 속성 이름을 확인
  const dbResponse = await fetch(`${NOTION_API_BASE}/databases/${databaseId}`, {
    method: "GET",
    headers: getHeaders(accessToken),
  });

  if (!dbResponse.ok) {
    throw new Error("Failed to fetch database schema");
  }

  const dbData = await dbResponse.json();

  // title 타입의 속성 이름 찾기 (기본값: "title" 또는 "Name" 또는 "이름")
  let titlePropertyName = "title";
  for (const [propName, propValue] of Object.entries(dbData.properties)) {
    if ((propValue as any).type === "title") {
      titlePropertyName = propName;
      break;
    }
  }

  const response = await fetch(`${NOTION_API_BASE}/pages`, {
    method: "POST",
    headers: getHeaders(accessToken),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        [titlePropertyName]: {
          title: [{ text: { content: title } }],
        },
      },
      children: blocks,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return `https://notion.so/${data.id.replace(/-/g, "")}`;
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

// Get user's databases
export async function getNotionDatabases(accessToken: string): Promise<any[]> {
  try {
    const databaseMap = new Map<string, any>();

    // 1. Search for top-level databases
    const searchResponse = await fetch(`${NOTION_API_BASE}/search`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        sort: {
          direction: "descending",
          timestamp: "last_edited_time",
        },
      }),
    });

    if (!searchResponse.ok) {
      throw new Error("Failed to search Notion");
    }

    const searchData = await searchResponse.json();

    // Add top-level databases
    searchData.results
      .filter((item: any) => item.object === "database")
      .forEach((db: any) => {
        databaseMap.set(db.id, {
          id: db.id,
          title: db.title?.[0]?.plain_text || "Untitled",
          url: db.url,
          last_edited_time: db.last_edited_time,
        });
      });

    // 2. Get pages and check for child databases
    const pages = searchData.results.filter((item: any) => item.object === "page");

    // Check each page for child databases
    for (const page of pages) {
      try {
        const blocksResponse = await fetch(
          `${NOTION_API_BASE}/blocks/${page.id}/children?page_size=100`,
          {
            method: "GET",
            headers: getHeaders(accessToken),
          }
        );

        if (!blocksResponse.ok) continue;

        const blocksData = await blocksResponse.json();

        // Find child_database blocks
        blocksData.results
          .filter((block: any) => block.type === "child_database")
          .forEach((block: any) => {
            const dbId = block.id;
            // Only add if not already in map
            if (!databaseMap.has(dbId)) {
              databaseMap.set(dbId, {
                id: dbId,
                title: block.child_database?.title || "Untitled",
                url: `https://notion.so/${dbId.replace(/-/g, "")}`,
                last_edited_time: block.last_edited_time || page.last_edited_time,
              });
            }
          });
      } catch (blockError) {
        // Skip pages where we can't read blocks
        console.warn(`Could not read blocks for page ${page.id}:`, blockError);
      }
    }

    // Convert map to array and sort by last_edited_time
    return Array.from(databaseMap.values()).sort(
      (a, b) =>
        new Date(b.last_edited_time).getTime() -
        new Date(a.last_edited_time).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch Notion databases:", error);
    throw new Error("Failed to fetch databases");
  }
}

// Create a new database in a page
export async function createNotionDatabase(
  accessToken: string,
  pageId: string,
  title: string = "Flownote Recordings"
): Promise<string> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/databases`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        parent: {
          type: "page_id",
          page_id: pageId,
        },
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
        properties: {
          title: {
            title: {},
          },
          format: {
            select: {
              options: [
                { name: "meeting", color: "blue" },
                { name: "interview", color: "green" },
                { name: "lecture", color: "purple" },
                { name: "custom", color: "gray" },
              ],
            },
          },
          duration: {
            number: {
              format: "number",
            },
          },
          created: {
            date: {},
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Notion API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Failed to create Notion database:", error);
    throw new Error("Failed to create database");
  }
}

// Create a new standalone page in the workspace
export async function createNotionStandalonePage(
  accessToken: string,
  title: string
): Promise<string> {
  try {
    // First, find the first accessible page to use as parent
    const searchResponse = await fetch(`${NOTION_API_BASE}/search`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        filter: {
          property: "object",
          value: "page",
        },
        page_size: 1,
      }),
    });

    if (!searchResponse.ok) {
      throw new Error("Failed to search Notion");
    }

    const searchData = await searchResponse.json();

    let parentId: string | undefined;
    if (searchData.results.length > 0) {
      parentId = searchData.results[0].id;
    }

    if (!parentId) {
      throw new Error("No accessible pages found in workspace");
    }

    const response = await fetch(`${NOTION_API_BASE}/pages`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        parent: {
          type: "page_id",
          page_id: parentId,
        },
        properties: {
          title: {
            title: [{ text: { content: title } }],
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Notion API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Failed to create Notion page:", error);
    throw new Error("Failed to create page");
  }
}

// Get user's pages (for creating database)
export async function getNotionPages(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/search`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        filter: {
          property: "object",
          value: "page",
        },
        sort: {
          direction: "descending",
          timestamp: "last_edited_time",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to search Notion");
    }

    const data = await response.json();

    return data.results.map((page: any) => ({
      id: page.id,
      title: page.properties?.title?.title?.[0]?.plain_text ||
             page.properties?.Name?.title?.[0]?.plain_text ||
             "Untitled",
      url: page.url,
      last_edited_time: page.last_edited_time,
    }));
  } catch (error) {
    console.error("Failed to fetch Notion pages:", error);
    throw new Error("Failed to fetch pages");
  }
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
  // Use btoa for Edge Runtime compatibility instead of Buffer
  const credentials = `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`;
  const auth = btoa(credentials);

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
