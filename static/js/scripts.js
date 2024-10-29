$(document).ready(function() {
    // 分词功能
    $('#segmentBtn').click(function() {
        const text = $('#inputText').val();
        if (text.trim() === '') {
            alert('请输入文言文文本！');
            return;
        }
        $.post({
            url: '/segment',
            contentType: 'application/json',
            data: JSON.stringify({ text }),
            success: function(response) {
                $('#resultOutput').text('分词结果: ' + response.segmented_text.join('.'));
            },
            error: function() {
                $('#resultOutput').text('处理分词请求时出错。');
            }
        });
    });

    // 词性标注功能
    $('#posTagBtn').click(function() {
        const text = $('#inputText').val();
        if (text.trim() === '') {
            alert('请输入文言文文本！');
            return;
        }
        $.post({
            url: '/pos_tag',
            contentType: 'application/json',
            data: JSON.stringify({ text }),
            success: function(response) {
                const posTags = response.pos_tagged_text.join('.');
                $('#resultOutput').text('词性标注结果: ' + posTags);
            },
            error: function() {
                $('#resultOutput').text('处理词性标注请求时出错。');
            }
        });
    });
    $('#punctuationBtn').click(function() {
    const text = $('#inputText').val();
    if (text.trim() === '') {
        alert('请输入文言文文本！');
        return;
    }
    $.post({
        url: '/biaodian',
        contentType: 'application/json',
        data: JSON.stringify({ text }),
        success: function(response) {
            // 将标点结果数组转换为字符串
            var punctuatedTextStr = response.punctuated_text.join('');
            $('#resultOutput').text('标点结果: ' + punctuatedTextStr);
        },
        error: function() {
            $('#resultOutput').text('处理标点请求时出错。');
        }
    });
});
    // 断句功能
    $('#punctuateBtn').click(function() {
        const text = $('#inputText').val();
        if (text.trim() === '') {
            alert('请输入文言文文本！');
            return;
        }
        $.post({
            url: '/punctuate',
            contentType: 'application/json',
            data: JSON.stringify({ text }),
            success: function(response) {
                $('#resultOutput').text('断句结果: ' + response.punctuated_text);
            },
            error: function() {
                $('#resultOutput').text('处理断句请求时出错。');
            }
        });
    });
});     
//标点功能
    $('#punctuationBtn').click(function() {
        const text = $('#inputText').val();
        if (text.trim() === '') {
            alert('请输入文言文文本！');
            return;
        }
        $.post({
            url: '/biaodian',
            contentType: 'application/json',
            data: JSON.stringify({ text }),
            success: function(response) {
                // 将标点结果数组转换为字符串
                var punctuatedTextStr = response.punctuation_text.join('');
                $('#resultOutput').text('标点结果: ' + punctuatedTextStr);
            },
            error: function() {
                $('#resultOutput').text('处理标点请求时出错。');
            }
        });
        
    });
    $('#imageUpload').change(function() {
        const file = this.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            $.ajax({
                url: '/upload_image',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.error) {
                        alert(response.error);
                    } else {
                        $('#resultOutput').text('图片文字识别结果: ' + response.segmented_text);
                    }
                },
                error: function() {
                    $('#resultOutput').text('处理图片文字识别请求时出错。');
                }
            });
        }
    });

    