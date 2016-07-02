#coding: utf-8
import hashlib
from xml.etree import ElementTree
from django.utils.encoding import *
from msg import Message
from urllib import urlencode
import requests
import time

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
    tmpstr = "%s%s%s"%tuple(tmpList)
    tmpstr = hashlib.sha1(tmpstr).hexdigest()
    if tmpstr == signature:
        return echoStr
    else:
        return None

# response to the msg
def responseMsg(request):
    postContent = request.body
    postStr = smart_str(postContent)
    token = request.session['token']
    # post content
    print postStr
    resultStr = None
    if postStr:
        msg = xmlContent2Dic(postStr)
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
    return urlencode(query)

# token decoration
def accessToken(func):
    def accessToken(request):
        url = "https://api.weixin.qq.com/cgi-bin/token"
        response = requests.get(url,dict(grant_type="client_credential",appid="wxf2f3abb77119d45b",secret="d6ecb363157505efdcbbf0cefa9ee637")).json()
        ts = int(time.time())
        if 'token' not in request.session or ts-request.session['timeStamp']>=6000:
            request.session['token'] = response['access_token']
            request.session['timeStamp'] = ts
        result = func(request)
        return result
    return accessToken



