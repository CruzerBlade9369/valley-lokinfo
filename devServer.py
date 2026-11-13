from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent
PUBLISHED_DIR = PROJECT_DIR / "_site"
CUSTOM_DIR = PROJECT_DIR / "scripts"

class CustomHandler(SimpleHTTPRequestHandler):

    def translate_path(self, path):
        # Custom development files
        if path.startswith("/scripts/"):
            relative_path = path[len("/scripts/"):]
            return str(CUSTOM_DIR / relative_path)

        # Everything else comes from the Silex publication
        relative_path = path.lstrip("/")
        return str(PUBLISHED_DIR / relative_path)

server = ThreadingHTTPServer(
    ("127.0.0.1", 8000),
    CustomHandler
)

print("Development server running at http://localhost:8000")
server.serve_forever()
