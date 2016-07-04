#coding=utf-8

'''
Author: Da
Date: 03072016
'''

from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from utils import checkSignature
from utils import responseMsg
from utils import accessToken
from utils import getToken
from utils import getUserInfo
from models import Discount_Info
from models import Visitor
from models import Rate

@csrf_exempt
@accessToken
def entry(request):
    '''
    check the service
    :param request:
    :return:
    '''
    if request.method == 'GET':
        response = HttpResponse(checkSignature(request),content_type="text/plain")
    elif request.method == 'POST':
        response=  HttpResponse(responseMsg(request),content_type="application/xml")
    else:
        response = None
    print "response \n %s"%response
    return response

def login(request):
    '''
    authentication
    :param request:
    :return:
    '''
    if request.method == 'GET':
        code = request.GET.get("code", None)
    # request for the access_token and refresh token
    print "code: %s"%code
    r = getToken(code)
    if r:
        # get user info
        userInfo = getUserInfo(r['access_token'],r['openid'])
        discounts = Discount_Info.objects.filter(lang=0).order_by('-dis_id')
        rates = Rate.objects.all()
        # store user info
        is_exist = Visitor.objects.get(openid=userInfo['openid'])
        if not is_exist:
            user = Visitor()
        # 存在即更新
        else:
            user = is_exist
        for key in user.__dict__:
            if key in userInfo:
                setattr(user, key, userInfo[key])
        user.save()
        return render_to_response('index.html', dict(data=userInfo, discounts=discounts, rates=rates) )
    # else:
    response = HttpResponse(u"认证失败")
    return response

def index(request):
    '''
    render index
    :param request:
    :return:
    '''
    discounts = Discount_Info.objects.filter(lang=0).order_by('-dis_id')
    ha = {u'province': u'', u'openid': u'oa6cGt4PrUC9BSWuK09IvehmgcNUaa',
          u'headimgurl': u'http://wx.qlogo.cn/mmopen/PiajxSqBRaELwKcgGMFpnGn4WNVzPicUMoOuI0foZ06uozNK2pC4Bu96VibfyRDzvrkMY2kdSPEMcj97McG2J4a5A/0',
          u'language': u'zh_CN', u'city': u'', u'country': '\xe4\xb8\xad\xe5\x9b\xbd', u'sex': 1, u'privilege': [],
          u'nickname': '\xe5\xb0\x8f\xe5\x93\x92'}

    is_exist = Visitor.objects.filter(openid=ha['openid'])
    if not is_exist:
        user = Visitor()
    # 存在即更新
    else:
        user = is_exist[0]
    for key in user.__dict__:
        if key in ha:
            setattr(user, key, ha[key])
    user.save()
    rates = Rate.objects.all()
    return render_to_response('index.html', dict(data=ha,rates=rates , discounts=discounts))