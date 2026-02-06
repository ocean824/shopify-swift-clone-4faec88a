import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ONLYSOCIAL_API_BASE = "https://app.onlysocial.io/os/api";

interface OnlySocialRequest {
  action: 
    | "list_accounts" 
    | "create_post" 
    | "schedule_post" 
    | "add_to_queue" 
    | "list_posts" 
    | "get_post"
    | "delete_post"
    | "list_media"
    | "list_tags";
  
  // For creating/scheduling posts
  post?: {
    body?: string;
    date?: string; // ISO date for scheduling
    time?: string; // HH:mm format
    accounts?: string[]; // Account UUIDs to post to
    media_uuids?: string[]; // Media file UUIDs to attach
  };
  
  // For post operations
  post_uuid?: string;
  
  // Pagination
  page?: number;
  limit?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("ONLYSOCIAL_API_TOKEN");
    const workspaceUuid = Deno.env.get("ONLYSOCIAL_WORKSPACE_UUID");
    
    if (!apiToken) {
      throw new Error("ONLYSOCIAL_API_TOKEN is not configured");
    }
    if (!workspaceUuid) {
      throw new Error("ONLYSOCIAL_WORKSPACE_UUID is not configured");
    }

    const request: OnlySocialRequest = await req.json();
    console.log("OnlySocial trigger received:", request.action);

    const headers = {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Construct base URL correctly - workspaceUuid should NOT include the full URL
    const baseUrl = `${ONLYSOCIAL_API_BASE}/${workspaceUuid}`;
    console.log("OnlySocial base URL:", baseUrl);
    let result;

    switch (request.action) {
      case "list_accounts": {
        // Get all connected social accounts
        const response = await fetch(`${baseUrl}/accounts`, {
          method: "GET",
          headers,
        });
        result = await response.json();
        break;
      }

      case "create_post": {
        // Create a new post (draft)
        if (!request.post) {
          throw new Error("post data required for create_post");
        }

        const postData = {
          body: request.post.body || "",
          accounts: request.post.accounts || [],
          media: request.post.media_uuids || [],
        };

        const response = await fetch(`${baseUrl}/posts`, {
          method: "POST",
          headers,
          body: JSON.stringify(postData),
        });
        result = await response.json();
        break;
      }

      case "schedule_post": {
        // Schedule an existing post
        if (!request.post_uuid) {
          throw new Error("post_uuid required for schedule_post");
        }
        if (!request.post?.date || !request.post?.time) {
          throw new Error("post.date and post.time required for schedule_post");
        }

        const scheduleData = {
          date: request.post.date,
          time: request.post.time,
        };

        const response = await fetch(`${baseUrl}/posts/schedule/${request.post_uuid}`, {
          method: "POST",
          headers,
          body: JSON.stringify(scheduleData),
        });
        result = await response.json();
        break;
      }

      case "add_to_queue": {
        // Add a post to the queue (uses workspace queue settings)
        if (!request.post_uuid) {
          throw new Error("post_uuid required for add_to_queue");
        }

        const response = await fetch(`${baseUrl}/posts/add-to-queue/${request.post_uuid}`, {
          method: "POST",
          headers,
        });
        result = await response.json();
        break;
      }

      case "list_posts": {
        // List all posts with optional pagination
        const page = request.page || 1;
        const limit = request.limit || 20;
        
        const response = await fetch(`${baseUrl}/posts?page=${page}&limit=${limit}`, {
          method: "GET",
          headers,
        });
        result = await response.json();
        break;
      }

      case "get_post": {
        // Get a specific post
        if (!request.post_uuid) {
          throw new Error("post_uuid required for get_post");
        }

        const response = await fetch(`${baseUrl}/posts/${request.post_uuid}`, {
          method: "GET",
          headers,
        });
        result = await response.json();
        break;
      }

      case "delete_post": {
        // Delete a post
        if (!request.post_uuid) {
          throw new Error("post_uuid required for delete_post");
        }

        const response = await fetch(`${baseUrl}/posts/${request.post_uuid}`, {
          method: "DELETE",
          headers,
        });
        result = await response.json();
        break;
      }

      case "list_media": {
        // List all uploaded media files
        const page = request.page || 1;
        const limit = request.limit || 20;
        
        const response = await fetch(`${baseUrl}/media?page=${page}&limit=${limit}`, {
          method: "GET",
          headers,
        });
        result = await response.json();
        break;
      }

      case "list_tags": {
        // List all tags for organizing content
        const response = await fetch(`${baseUrl}/tags`, {
          method: "GET",
          headers,
        });
        result = await response.json();
        break;
      }

      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("OnlySocial trigger error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
