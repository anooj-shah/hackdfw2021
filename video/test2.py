entire_text = "He walked over to the window and reflected on his deserted surroundings. He had always Athens with its loved pretty abundant, annoyed arches. It was place that encouraged his a tendency to feel eclectic. They looked at each other with sleepy feelings, like two fried, frightened foxes eating at a very daring accident, which had piano music playing in the background and two intuitive uncles cooking to the beat. "
entire_text_arr = entire_text.strip().split('.')
context_sentence = ''
vocabWordValue = 'abundant'
flag = False
for i in range(len(entire_text_arr)):
  line = entire_text_arr[i]
  line_arr = line.split(' ')
  for j in range (len(line_arr)):
    word = line_arr[j].lower().strip()
    word = word.replace(',', '')
    if word == vocabWordValue.lower():
      context_sentence = entire_text_arr[i]
      flag = True
      break
  if flag:
    break

print(context_sentence)