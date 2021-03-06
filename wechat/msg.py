#coding=utf-8

'''
Author: Da
Date: 03072016
'''

import time

# all msg are defined here.
class Message:
    def __init__(self, **kwargs):
        # dict for reflection
        self.result = {
            "text": self.textMsg,
            "image": self.imgMsg,
        }

        # default text.
        if not "text" in kwargs:
            kwargs['text'] = u"发张图片试试?"

        # define msg type by args.
        if "type" and "msg" in kwargs:
            self.response = self.result[kwargs['type']](kwargs['msg'], kwargs['text'])

    # return response
    def __repr__(self):
        return self.response

    # text msg
    def textMsg(self, msg, text):
        response = "<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]>" \
                  "</FromUserName><CreateTime>%s</CreateTime><MsgType><![CDATA[%s]]></MsgType>" \
                  "<Content><![CDATA[%s]]></Content></xml>"
        response = response % (msg['FromUserName'],msg['ToUserName'],str(int(time.time())),'text', text)
        return response

    # image msg
    def imgMsg(self, msg, text):
        response = "<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]>" \
                   "</FromUserName><CreateTime>%s</CreateTime><MsgType><![CDATA[%s]]></MsgType>" \
                   "<Image><MediaId><![CDATA[%s]]></MediaId></Image></xml>"
        response = response % (msg['FromUserName'], msg['ToUserName'], str(int(time.time())), 'image', msg['MediaId'])
        return response

# temporary test
# msg=dict(FromUserName="zhangda",ToUserName="xiaoda")
# test = Message(type="text",msg=msg )
# print test