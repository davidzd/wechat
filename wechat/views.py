# coding: utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext
import time
from django.views.decorators.csrf import csrf_exempt
from utils import checkSignature
from utils import responseMsg
from utils import accessToken

# check the service
@csrf_exempt
def entry(request):
    print request.GET.get('echostr')
    if request.method == 'GET':
        response = HttpResponse(checkSignature(request),content_type="text/plain")
    elif request.method == 'POST':
        response=  HttpResponse(responseMsg(request),content_type="application/xml")
    else:
        response = None
    print response
    return response

def login(request):
    response = HttpResponse("hahahah")
    return response

@accessToken
def index(request):
    response = HttpResponse("index")
    return response