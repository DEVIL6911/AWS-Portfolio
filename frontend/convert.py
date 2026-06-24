import base64
import os

img_path = r"C:\Users\91883\.gemini\antigravity-ide\brain\9f61ef0e-2b97-48be-ab14-5eed623c1296\media__1782299138986.png"
out_path = r"d:\nitin loda\AWS-SBG-website-\frontend\src\assets\logoBase64.js"

os.makedirs(os.path.dirname(out_path), exist_ok=True)

with open(img_path, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

with open(out_path, "w") as f:
    f.write(f'export const CLOUD_LOGO = "data:image/png;base64,{b64}";\n')
print("Done")
