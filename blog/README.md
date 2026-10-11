# Writing a blog post

1. Create `blog/posts/<slug>.md` (e.g. `blog/posts/my-new-post.md`) and write the post in Markdown.
   Don't add a title at the top — it comes from `posts.json`.
2. Add an entry to `blog/posts.json`:

   ```json
   {
       "slug": "my-new-post",
       "title": "My New Post",
       "date": "2026-10-20",
       "summary": "One or two sentences shown on the blog listing.",
       "tags": ["IT", "Networking"]
   }
   ```

   - `slug` must match the filename (without `.md`).
   - `date` is `YYYY-MM-DD`; posts are sorted newest first automatically.
   - Add `"draft": true` to hide a post until it's ready.
   - Remember the comma between entries.
3. Commit and push.

Images: put them in `images/blog/` and reference them as `![Description](../images/blog/photo.jpg)`.

## Previewing locally

Opening the HTML files directly won't load posts (browsers block `fetch` from `file://`). From the repo root run:

```sh
python3 -m http.server 8000
```

then open http://localhost:8000/blog/
