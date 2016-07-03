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
        print userInfo
        return render_to_response('index.html', dict(data=userInfo) )
    # else:
    response = HttpResponse(u"认证失败")
    return response

def index(request):
    '''
    render index
    :param request:
    :return:
    '''
    user = dict(argu="sb")
    return render_to_response('index.html', dict(data=user))