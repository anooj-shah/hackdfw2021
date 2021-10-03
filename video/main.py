import cv2
from matplotlib import pyplot as plt
from rekognition import Rekognizer
try:
    from PIL import Image
except ImportError:
    import Image
import numpy
import time

prevWords = set()

video_capture = cv2.VideoCapture(0)    
if not video_capture.isOpened():
  print('err')                        
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
  cv2.destroyAllWindows()
  return frames

def addWordsToPrevOrg(text, textSplit):
  global prevWords
  prevWords = set()
  if len(textSplit) > 100 or len(textSplit) < 50:
    print('TOO SMALL')
    return

  print('ohboy', prevWords, textSplit)
  for word in textSplit:
    prevWords.add(word)

  rekognizer.update_num_words_read(len(textSplit))
  rekognizer.send_text_to_firestore(text)
  rekognizer.speak_words(text)

def iterate_frames(frames):
  global prevWords
  rekognizer.get_speed_from_firestore()
  for frame in frames:
    cv2.imwrite('video/images/frame.jpg', frame)
    src = cv2.imread('video/images/frame.jpg')
    image = cv2.rotate(src, cv2.cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite('video/images/frame.jpg', image)
    print('written')
    text = rekognizer.detect_words('video/images/frame.jpg')
    textSplit = text.split(' ')
    if len(prevWords) == 0:
      addWordsToPrevOrg(text, textSplit)
    else:
      correct = 0
      wrong = 0
      for word in textSplit:
        if word in prevWords:
          correct += 1
        else:
          wrong += 1
      if wrong > correct:  
        addWordsToPrevOrg(text, textSplit)
    # Read one sentence at a time - nah

while True:
  print('ok')
  frames = get_frames(1)
  iterate_frames(frames)
  time.sleep(3)
  print('next')

video_capture.release()
