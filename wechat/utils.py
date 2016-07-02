#coding: utf-8
import hashlib
from xml.etree import ElementTree
import time
from django.utils.encoding import *

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
def responseMsg(postContent):
    postStr = smart_str(postContent)
    if postStr:
        msg = xmlContent2Dic(postStr)
        if msg['MsgType']:
            if msg['MsgType'] == 'event':
                resultStr = handleEvent(msg)
        else:
            resultStr = 'Input something...'
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
def handleEvent(msg):
    if msg['Event'] == 'subscribe':
        resultStr="<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]></FromUserName><CreateTime>%s</CreateTime><MsgType><![CDATA[%s]]></MsgType><Content><![CDATA[%s]]></Content></xml>"
        resultStr = resultStr % (msg['FromUserName'],msg['ToUserName'],str(int(time.time())),'text',u'我就是试着玩的,没想到你还真关注了.')
    return resultStr