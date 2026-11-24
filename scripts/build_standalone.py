#!/usr/bin/env python3
"""
Builds NyayaDesk-Standalone.html using classic IIFE <script> (no type="module")
so that iOS Safari, htmlpreview.github.io, raw.githack.com, and local file:// opens
work reliably 100% of the time without blank white screens.
"""
import glob
import os
import subprocess

# Convert Vite's ESM bundle into a classic self-executing IIFE bundle
js_files = sorted(glob.glob("dist/assets/index-*.js"))
css_files = sorted(glob.glob("dist/assets/index-*.css"))
assert js_files and css_files, "Run npm run build first!"

subprocess.run(
    [
        "npx",
        "esbuild",
        js_files[0],
        "--bundle",
        "--format=iife",
        "--target=es2019",
        "--minify",
        "--outfile=/tmp/nyayadesk_iife.js",
    ],
    check=True,
)

css = open(css_files[0], encoding="utf-8").read()
js = open("/tmp/nyayadesk_iife.js", encoding="utf-8").read()

# Escape any accidental </script> or </style> sequences inside minified literals
js_safe = js.replace("</script", "<\\/script")
css_safe = css.replace("</style", "<\\/style")

standalone_html = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="NyayaDesk" />
    <link rel="apple-touch-icon" href="https://raw.githubusercontent.com/yashasvamoond-commits/client-manager/arena/df2a2b26-client-manager/public/apple-touch-icon.png" />
    <title>NyayaDesk — Advocate Client Manager &amp; Indian Law Suite</title>
    <style>{css_safe}</style>
  </head>
  <body>
    <div id="root">
      <div style="padding:32px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f172a;">
        Loading NyayaDesk Advocate Suite...
      </div>
    </div>
    <script>{js_safe}</script>
  </body>
</html>
"""

with open("NyayaDesk-Standalone.html", "w", encoding="utf-8") as f:
    f.write(standalone_html)

print(f"Built NyayaDesk-Standalone.html ({os.path.getsize('NyayaDesk-Standalone.html') / 1024:.1f} KB)")
