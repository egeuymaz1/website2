import os
import subprocess
from PIL import Image

# Configuration
ROOT_DIR = "."  # Root directory to scan for files

# MP4 compression settings
MP4_SCALE = "1280:-2"  # Scale width to 1280px, height auto (-2 preserves aspect)
MP4_CRF = "50"         # CRF 28 is a good default for quality/size tradeoff
MP4_PRESET = "slow"    # ffmpeg preset for encoding speed/efficiency

def compress_mp4(file_path):
    """Re-encode the MP4 to reduce size, overwrite original."""
    dirpath, filename = os.path.split(file_path)
    name, ext = os.path.splitext(filename)
    temp_path = os.path.join(dirpath, f"{name}_temp.mp4")
    
    cmd = [
        "ffmpeg", "-y", "-i", file_path,
        "-vf", f"scale={MP4_SCALE}",
        "-c:v", "libx264", "-preset", MP4_PRESET, "-crf", MP4_CRF,
        "-c:a", "copy",
        temp_path
    ]
    subprocess.run(cmd, check=True)
    os.replace(temp_path, file_path)
    print(f"Compressed MP4: {file_path}")

def convert_png_to_jpeg(file_path):
    """Convert PNG to JPEG, keep same base name, delete original PNG."""
    dirpath, filename = os.path.split(file_path)
    name, ext = os.path.splitext(filename)
    jpeg_path = os.path.join(dirpath, f"{name}.jpg")
    
    with Image.open(file_path) as img:
        rgb = img.convert("RGB")
        rgb.save(jpeg_path, format="JPEG", quality=85)  # quality 85 defaults
    os.remove(file_path)
    print(f"Converted PNG to JPEG: {file_path} -> {jpeg_path}")

def main():
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        for fname in filenames:
            full_path = os.path.join(dirpath, fname)
            lower = fname.lower()
            if lower.endswith(".mp4"):
                try:
                    compress_mp4(full_path)
                except subprocess.CalledProcessError as e:
                    print(f"Error compressing {full_path}: {e}")
            elif lower.endswith(".png"):
                try:
                    convert_png_to_jpeg(full_path)
                except Exception as e:
                    print(f"Error converting {full_path}: {e}")

if __name__ == "__main__":
    main()

# Dependencies:
#   pip install pillow
#   Ensure `ffmpeg` is installed and on your PATH.
