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
import smtplib
import email.MIMEMultipart
import email.MIMEText
import email.MIMEBase
import os.path
import urllib2
from weixin.settings import FILE_ROOT
from mail import mailto

# init token.
TOKEN = "weixin"
appid = "wx4a33e66972710919"
appsecret = "9d3ca01be1e9510e59582d63f753fc3c"


# check signature from wechat server.
def checkSignature(request):
    global TOKEN
    signature = request.GET.get("signature", None)
    timestamp = request.GET.get("timestamp", None)
    nonce = request.GET.get("nonce", None)
    echoStr = request.GET.get("echostr", None)
    token = TOKEN
    tmpList = [token, timestamp, nonce]
    tmpList.sort()
    # tmpstr = "%s%s%s"%tuple(tmpList)
    sha1 = hashlib.sha1()
    map(sha1.update, tmpList)
    tmpstr = sha1.hexdigest()
    if tmpstr == signature:
        return echoStr
    else:
        return None

def requestAndSave(url):
    a = urllib2.urlopen(url)
    with open('result.txt', 'wb') as f:
        f.write(a.read())


def checkTicket(date):
    url = 'http://www.12306.cn/opn/lcxxcx/query?' \
          'purpose_codes=ADULT&queryDate=' + date + '&' \
                                                    'from_station=BJP&to_station=CCT'
    trains = json.loads(urllib2.urlopen(url).read())['data']['datas']
    for t in trains:
        if t['train_no'] == "240000G38306" or ['train_no'] == "240000G38107":
            if t["gg_num"] != "--" or \
                            t["gr_num"] != "--" or \
                            t["qt_num"] != "--" or \
                            t["ze_num"] != "--":
                return True
    return False


# print checkTicket('2016-09-01')
# <xml><ToUserName><![CDATA[gh_a20a55fc187d]]></ToUserName>
# <FromUserName><![CDATA[oa6cGt4PrUC9BSWuK09IvehmgcNU]]></FromUserName>
# <CreateTime>1477374117</CreateTime>
# <MsgType><![CDATA[text]]></MsgType>
# <Content><![CDATA[https://mp.weixin.qq.com/wiki/17/f298879f8fb29ab98b2f2971d42552fd.html]]></Content>
# <MsgId>6345273516882486256</MsgId>
# </xml>
# response to the msg
def responseMsg(request):
    postContent = request.body
    postStr = smart_str(postContent)
    # post content2
    print postStr
    resultStr = None
    if postStr:
        msg = xmlContent2Dic(postStr)
        msg['token'] = request.session['token']
        msg['MediaId'] = "Xd2kobaqZAy_Hb1Y-JylTEoxhY-CduAqJVFDTJp1S0SE0f-Uctcj9I5PuZM1hPkA"
        if msg['MsgType']:
            if msg['MsgType'] == 'event':
                resultStr = handleEvent(msg)
            elif msg['MsgType'] == 'image':
                resultStr = handleImage(msg)
            else:
                print msg['Content']
                # requestAndSave(msg['Content'])
                resultStr = Message(type="text", msg=msg, text=u"火速前往你的kindle中")
                # mailto('davidzd@163.com', 'zhangdapi@kindle.cn',
                #        'result.txt')
                mailto('davidzd@163.com', '422586976@qq.com', 'xxf.txt')
        else:
            resultStr = Message(type="text", msg=msg)
        return resultStr


# transform xml into dict
def xmlContent2Dic(xmlContent):
    dics = {}
    elementTree = ElementTree.fromstring(xmlContent)
    if elementTree.tag == 'xml':
        for child in elementTree:
            dics[child.tag] = smart_unicode(child.text)
    return dics


# handler for Event
def handleImage(msg):
    url = saveImage(msg['PicUrl'])
    path = saveImage(url)
    path = imageMark(path)
    msg['MediaId'] = upload(path, 'image', msg['token'])['media_id']
    resultStr = Message(type="image", msg=msg, text=u'只要你跟我说话,我就给你一个神奇的链接.')
    return resultStr


# handler for Event
def handleEvent(msg):
    if msg['Event'] == 'subscribe':
        resultStr = Message(type="text", msg=msg, text=u'只要你跟我"打折",我就给你一个神奇的链接. 或者你给我发图片,我就帮你加个美美的水印如何?')
    return resultStr


# to asc2
def encodeurl(url):
    query = dict(name=url)
    return urllib.urlencode(query)


# token decoration
def accessToken(func):
    def accessToken(request):
        url = "https://api.weixin.qq.com/cgi-bin/token"
        response = requests.get(url, dict(grant_type="client_credential", appid=appid, secret=appsecret)).json()
        ts = int(time.time())
        if 'token' not in request.session or ts - request.session['timeStamp'] >= 6000:
            request.session['token'] = response['access_token']
            request.session['timeStamp'] = ts
        result = func(request)
        return result

    return accessToken


# get OAUTH2 TOKEN
def getToken(code):
    url = "https://api.weixin.qq.com/sns/oauth2/access_token"
    response = requests.get(url, dict(appid=appid, secret=appsecret, code=code, grant_type="authorization_code")).json()
    print "reponse: %s" % response
    if "access_token" in response:
        return response
    return None


def getUserInfo(token, openid):
    url = "https://api.weixin.qq.com/sns/userinfo"
    print "token: %s" % token
    response = requests.get(url, dict(access_token=token, openid=openid, lang="zh_CN"))
    response = json.loads(response.content)
    if "openid" in response:
        return response
    return None


# save image
def saveImage(url):
    path = "/home/ubuntu/wechat/images/%s.jpg" % (time.time())
    data = urllib.urlopen(url).read()
    f = file(path, "wb")
    f.write(data)
    f.close()
    return path


# change image
def imageMark(path):
    text = u'那就买回来吃呀!'
    im = Image.open(path)
    mark = textToImg(text)
    image = watermark(im, mark, 'center', 0.8)
    if image:
        image.save(path)
        return path
    else:
        print "Sorry, Failed."


# text 2 Image
def textToImg(text, font_color="black", font_size=40):
    font = ImageFont.truetype("../images/WawaSC-Regular.otf", font_size)
    # multi lines
    text = text.split('\n')
    mark_width = 0
    for i in range(len(text)):
        (width, height) = font.getsize(text[i])
        if mark_width < width:
            mark_width = width
    mark_height = height * len(text) * 1
    print width, height
    # generate pic
    mark = Image.new('RGBA', (mark_width, mark_height))
    draw = ImageDraw.ImageDraw(mark, "RGBA")
    for i in range(len(text)):
        (width, height) = font.getsize(text[i])
        draw.text((0, i * height), text[i], font=font, fill=font_color)
    return mark


# set opacity
def setOpacity(im, opacity):
    assert opacity >= 0 and opacity < 1
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

        # set position
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

        layer = Image.new('RGBA', im.size, )
        layer.paste(mark, (x, y))
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
    response = requests.post(url, files=file, data=data)
    print "UPLOAD response \n %s" % response.json()
    return response.json()


# simsimi
def simsim(msg):
    trial = "a4328936-8cef-4baf-9c42-0f0b25b295f9"
    url = "http://sandbox.api.simsimi.com/request.p"
    response = requests.get(url, dict(key=trial, lc="zh", ft=0.0, text=msg))
    response = json.loads(response.content)['response']
    return response


# sim
def simsimteach(req, res):
    trial = "a4328936-8cef-4baf-9c42-0f0b25b295f9"
    url = "http://sandbox.api.simsimi.com/teach"
    response = requests.post(url, dict(key=trial, lc="zh", req=req, res=res))
    response = json.loads(response.content)
    return response

    # print saveImage("http://mmbiz.qpic.cn/mmbiz/KNgyCFSwIYcKNJr09gTCJ5S9og71Tlo2XvTSn6ByZhPybOfOuE906K7flkxJDoiaB73p6Ga3XrGLGPkvYjpPVsQ/0")
    # imageMark("../images/1467531704.02.jpg")
    # mark = textToImg('我喜欢大饼饼哈哈哈哈哈')
    # print mark
    # print encodeurl("http://www.misspiepie.com/wechat/login")

    # print getUserInfo("qaX71zFkvrKwH9zWFx1bq1FHq1NzRz4kwVV7ttL2nwIn-SBAuEbIMwrMZludj0bKKoHf34FQnRh69aU8F8LJ96L9LDx6RQWPAyKmBcMiAgo",'oa6cGt4PrUC9BSWuK09IvehmgcNU')
    # print simsimteach("三件事","哇,我听过这个超牛逼的团队")
