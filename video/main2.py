from threading import Thread
import cv2, time
from matplotlib import pyplot as plt
from rekognition import Rekognizer
try:
    from PIL import Image
except ImportError:
    import Image
import numpy

# video_capture = cv2.VideoCapture(1)                             
rekognizer = Rekognizer()

class ThreadedCamera(object):
  def __init__(self, src=0):
    self.capture = cv2.VideoCapture(src)
    self.capture.set(cv2.CAP_PROP_BUFFERSIZE, 2)

    # FPS = 1/X
    # X = desired FPS
    self.FPS = 1/30
    self.FPS_MS = int(self.FPS * 1000)

    # Start frame retrieval thread
    self.thread = Thread(target=self.update, args=())
    self.thread.daemon = True
    self.thread.start()

  def update(self):
    while True:
      if self.capture.isOpened():
        (self.status, self.frame) = self.capture.read()
      time.sleep(self.FPS)

  def show_frame(self):
    cv2.imshow('frame', self.frame)
    cv2.imwrite('video/images/frame.jpg', self.frame)
    src = cv2.imread('video/images/frame.jpg')
    image = cv2.rotate(src, cv2.cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite('video/images/frame.jpg', image)
    text = rekognizer.detect_words('video/images/frame.jpg')
    # Read one sentence at a time - nah
    rekognizer.send_text_to_firestore(text)
    cv2.waitKey(self.FPS_MS)

if __name__ == '__main__':
  threaded_camera = ThreadedCamera(1)
  idx = 0
  while True:
    try:
      idx += 1
      if idx % 8 == 0:
        threaded_camera.show_frame()
    except AttributeError:
      pass