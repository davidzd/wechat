# coding: utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext
import time
from django.views.decorators.csrf import csrf_exempt
from utils import checkSignature

# check the service
@csrf_exempt
def check(request):
    if request.method == 'GET':
        response = HttpResponse(checkSignature(request),content_type="text/plain")
        return response
    else:
        return None
