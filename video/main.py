import cv2
from matplotlib import pyplot as plt
from rekognition import Rekognizer
try:
    from PIL import Image
except ImportError:
    import Image
import numpy

video_capture = cv2.VideoCapture(1)                             
rekognizer = Rekognizer()

# run rekognizer.detect_words('photo/path/photo.jpg')

def get_frames(num_frames=1000):
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
  rekognizer.get_speed_from_firestore()
  for frame in frames:
    cv2.imwrite('video/images/frame.jpg', frame)
    src = cv2.imread('video/images/frame.jpg')
    image = cv2.rotate(src, cv2.cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite('video/images/frame.jpg', image)
    text = rekognizer.detect_words('video/images/frame.jpg')
    # Read one sentence at a time - nah
    rekognizer.send_text_to_firestore(text)


frames = get_frames(1)
iterate_frames(frames)
