from flask import Flask, request, jsonify, render_template
from jiayan import load_lm, CRFPunctuator, CRFSentencizer,CharHMMTokenizer,CRFPOSTagger
from PIL import Image
import pytesseract
app = Flask(__name__)

# 加载 Jiayan 模型
lm = load_lm('jiayan.klm')
punctuator = CRFPunctuator(lm, 'cut_model')
tokenizer = CharHMMTokenizer(lm)
postagger = CRFPOSTagger()
postagger.load('pos_model')
sentencizer = CRFSentencizer(lm)
sentencizer.load('cut_model')
lm = load_lm('jiayan.klm')
punctuator = CRFPunctuator(lm, 'cut_model')
punctuator.load('punc_model')
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/segment', methods=['POST'])
def segment():
    text = request.json.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # 分词
    segmented_text = tokenizer.tokenize(text)
    # 确保将生成器转换为列表
    segmented_text_list = list(segmented_text)

    return jsonify({'segmented_text': segmented_text_list})

@app.route('/pos_tag', methods=['POST'])
def pos_tag():
    text = request.json.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # 词性标注
    pos_tagged_text = postagger.postag(text)
    pos_tagged_text_list=list(pos_tagged_text)
    return jsonify({'pos_tagged_text': pos_tagged_text_list})

@app.route('/punctuate', methods=['POST'])
def punctuate():
    text = request.json.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # 断句
    punctuated_text = sentencizer.sentencize(text)
    punctuated_text_list=list(punctuated_text)
    return jsonify({'punctuated_text': punctuated_text_list})

@app.route('/biaodian', methods=['POST'])
def punction():
    text = request.json.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # 标点
    punctuation_text = punctuator.punctuate(text)
    punctuation_text_list=list(punctuation_text)
    
    return jsonify({'punctuation_text': punctuation_text_list})
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No image selected for uploading'}), 400

    if file:
        image = Image.open(file.stream)
        text = pytesseract.image_to_string(image, lang='chi_sim')
        if text:
            punctuated_text = sentencizer.sentencize(text)
            punctuated_text_list = list(punctuated_text)
            return jsonify({'segmented_text': punctuated_text_list})
        else:
            return jsonify({'error': 'No text detected in the image'}), 400
if __name__ == '__main__':
    app.run(debug=True)