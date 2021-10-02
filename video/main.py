import cv2
from matplotlib import pyplot as plt

video_capture = cv2.VideoCapture(0)

def get_frames(num_frames=10):
  frames = []

  for i in range (num_frames):
    print(i)
    ret, frame = video_capture.read()
    if not ret:
      print("Frame not read")
      continue

    frames.append(frame)
  video_capture.release()
  cv2.destroyAllWindows()
  return frames

def iterate_frames(frames):
  for frame in frames[0:]:
    plt.imshow(frame)
    plt.show()
  
frames = get_frames(10)
iterate_frames(frames)
