#coding=utf-8

'''
Author: Da
Date: 03072016
'''

from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from utils import checkSignature
from utils import responseMsg
from utils import accessToken
from utils import getToken
from utils import getUserInfo

# check the service
@csrf_exempt
@accessToken
def entry(request):
    if request.method == 'GET':
        response = HttpResponse(checkSignature(request),content_type="text/plain")
    elif request.method == 'POST':
        response=  HttpResponse(responseMsg(request),content_type="application/xml")
    else:
        response = None
    print "response \n %s"%response
    return response

# authentication
def login(request):
    if request.method == 'GET':
        code = request.GET.get("code", None)
    # request for the access_token and refresh token
    r = getToken(code)
    if r:
        # get user info
        userInfo = getUserInfo(r['access_token'],r['openid'])
        response = HttpResponse(userInfo)
        return response
    # else:
    response = HttpResponse(u"认证失败")
    return response

# index
def index(request):
    response = HttpResponse("index")
    return response