#coding=utf-8

'''
Author: Da
Date: 03072016
'''

import hashlib
from xml.etree import ElementTree
from django.utils.encoding import *
from msg import Message
import urllib
import requests
import time
import json
from PIL import Image, ImageEnhance, ImageDraw, ImageFont

# init token.
TOKEN = "weixin"

# check signature from wechat server.
def checkSignature(request):
    global TOKEN
    signature = request.GET.get("signature", None)
    timestamp = request.GET.get("timestamp", None)
    nonce = request.GET.get("nonce", None)
    echoStr = request.GET.get("echostr",None)
    token = TOKEN
    tmpList = [token,timestamp,nonce]
    tmpList.sort()
    # tmpstr = "%s%s%s"%tuple(tmpList)
    sha1 = hashlib.sha1()
    map(sha1.update, tmpList)
    tmpstr = sha1.hexdigest()
    if tmpstr == signature:
        return echoStr
    else:
        return None

# response to the msg
def responseMsg(request):
    postContent = request.body
    postStr = smart_str(postContent)
    # post content
    print postStr
    resultStr = None
    if postStr:
        msg = xmlContent2Dic(postStr)
        msg['token'] = request.session['token']
        if msg['MsgType']:
            if msg['MsgType'] == 'event':
                resultStr = handleEvent(msg)
            elif msg['MsgType'] == 'image':
                resultStr = handleImage(msg)
            else:
                resultStr = Message(type="text", msg=msg)
        else:
            resultStr = Message(type="text",msg=msg)
        return resultStr

# transform xml into dict
def xmlContent2Dic(xmlContent):
    dics = {}
    elementTree = ElementTree.fromstring(xmlContent)
    if elementTree.tag == 'xml':
        for child in elementTree :
            dics[child.tag] = smart_unicode(child.text)
    return dics

# handler for Event
def handleImage(msg):
    url = saveImage(msg['PicUrl'])
    path = saveImage(url)
    path = imageMark(path)
    msg['MediaId'] = upload(path,'image',msg['token'])['media_id']
    resultStr = Message(type="image", msg=msg, text=u'我就是试着玩的,没想到你还真关注了.')
    return resultStr

# handler for Event
def handleEvent(msg):
    if msg['Event'] == 'subscribe':
        resultStr=Message(type="text",msg=msg,text=u'我就是试着玩的,没想到你还真关注了.')
    return resultStr

# to asc2
def encodeurl(url):
    query = dict(name=url)
    return urllib.urlencode(query)

# token decoration
def accessToken(func):
    def accessToken(request):
        url = "https://api.weixin.qq.com/cgi-bin/token"
        response = requests.get(url,dict(grant_type="client_credential",appid="wx4a33e66972710919",secret="9d3ca01be1e9510e59582d63f753fc3c")).json()
        ts = int(time.time())
        if 'token' not in request.session or ts-request.session['timeStamp']>=6000:
            request.session['token'] = response['access_token']
            request.session['timeStamp'] = ts
        result = func(request)
        return result
    return accessToken

# save image
def saveImage(url):
    path = "/home/ubuntu/wechat/images/%s.jpg"%(time.time())
    data = urllib.urlopen(url).read()
    f = file(path, "wb")
    f.write(data)
    f.close()
    return path

# change image
def imageMark(path):
    text = u'我喜欢大饼饼哈哈哈哈'
    im = Image.open(path)
    mark = textToImg(text)
    image = watermark(im, mark, 'center', 0.9)
    if image:
        image.save(path)
        return path
    else:
        print "Sorry, Failed."


# text 2 Image
def textToImg(text, font_color="black", font_size=40):
    font = ImageFont.truetype("/home/ubuntu/wechat/images/WawaSC-Regular.otf",font_size)
    # multi lines
    text = text.split('\n')
    mark_width = 0
    for i in range(len(text)):
        (width, height) = font.getsize(text[i])
        if mark_width < width:
            mark_width = width
    mark_height = height* len(text)*2
    print width, height
    # generate pic
    mark = Image.new('RGBA', (mark_width, mark_height))
    draw = ImageDraw.ImageDraw(mark, "RGBA")
    draw.setfont(font)
    for i in range(len(text)):
        (width, height) = font.getsize(text[i])
        draw.text((0, i * height), text[i], fill=font_color)
    return mark

# set opacity
def setOpacity(im, opacity):

    assert opacity >=0 and opacity < 1
    if im.mode != "RGBA":
        im = im.convert('RGBA')
    else:
        im = im.copy()
    alpha = im.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    im.putalpha(alpha)
    return im

# set warter mark
def watermark(im, mark, position, opacity=1):
    try:
        if opacity < 1:
            mark = setOpacity(mark, opacity)
        if im.mode != 'RGBA':
            im = im.convert('RGBA')
        if im.size[0] < mark.size[0] or im.size[1] < mark.size[1]:
            print "The mark image size is larger size than original image file."
            return False

        #set position
        if position == 'left_top':
            x = 0
            y = 0
        elif position == 'left_bottom':
            x = 0
            y = im.size[1] - mark.size[1]
        elif position == 'right_top':
            x = im.size[0] - mark.size[0]
            y = 0
        elif position == 'right_bottom':
            x = im.size[0] - mark.size[0]
            y = im.size[1] - mark.size[1]
        else:
            x = (im.size[0] - mark.size[0]) / 2
            y = (im.size[1] - mark.size[1]) / 2

        layer = Image.new('RGBA', im.size,)
        layer.paste(mark,(x,y))
        return Image.composite(layer, im, layer)
    except Exception as e:
        print ">>>>>>>>>>> WaterMark EXCEPTION:  " + str(e)
        return False

# upload media
def upload(path, type, token):
    url = "https://api.weixin.qq.com/cgi-bin/media/upload"
    file = {'file': open(path, 'rb')}
    data = {
        'access_token': token,
        'type': type,
    }
    response = requests.post(url,files=file,data=data)
    print "UPLOAD response \n %s"%response.json()
    return response.json()




# print saveImage("http://mmbiz.qpic.cn/mmbiz/KNgyCFSwIYcKNJr09gTCJ5S9og71Tlo2XvTSn6ByZhPybOfOuE906K7flkxJDoiaB73p6Ga3XrGLGPkvYjpPVsQ/0")
# print imageMark("../images/WeChat_1467530177.jpeg")
