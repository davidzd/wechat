# coding: utf-8
from django.db import models
import datetime
from MySQLdb.constants.FLAG import AUTO_INCREMENT

class Discount_Info(models.Model):
    '''
    discount info
    '''
    # 打折信息 id
    dis_id = models.IntegerField(primary_key=True, null=False)
    # discount title
    dis_title = models.CharField(max_length=64, null=False, default='')
    # discount url
    dis_url = models.CharField(max_length=256, null=False, default='')
    # discount url
    addtime = models.CharField(max_length=32, null=False, default='')
    # status
    status = models.IntegerField(max_length=11, null=False, default='')
    # language
    lang = models.IntegerField(max_length=32, null=False, default=0)
    # date

    def __str__(self):
        return self.dis_title

    def getDate(self):
        print type(self.addtime)
        value = datetime.datetime.fromtimestamp(int(float(self.addtime)))
        return value.strftime('%Y-%m-%d %H:%M:%S')

    date = property(getDate)

    class Meta(object):
        db_table = 'discount_info'
        app_label = 'wechat'


# {
#     u'province': u'',
#     u'openid': u'oa6cGt4PrUC9BSWuK09IvehmgcNU',
#     u'headimgurl': u'http://wx.qlogo.cn/mmopen/PiajxSqBRaELwKcgGMFpnGn4WNVzPicUMoOuI0foZ06uozNK2pC4Bu96VibfyRDzvrkMY2kdSPEMcj97McG2J4a5A/0',
#     u'language': u'zh_CN',
#     u'city': u'',
#     u'country': u'\xe4\xb8\xad\xe5\x9b\xbd',
#     u'sex': 1,
#     u'privilege': [],
#     u'nickname': u'\xe5\xb0\x8f\xe5\x93\x92'
# }

class Visitor(models.Model):
    # openid
    openid = models.CharField(max_length=32, primary_key=True, null=False)
    # province
    province = models.CharField(max_length=32, null=False, default='')
    # headimgurl
    headimgurl = models.CharField(max_length=256, null=False, default='')
    # city
    city = models.CharField(max_length=32, null=False, default='')
    # country
    country = models.CharField(max_length=32, null=False, default='')
    # sex
    sex = models.IntegerField(max_length=8, null=False, default='')
    # nickname
    nickname = models.CharField(max_length=32, null=False, default='')
    # visit_time
    visit_time = models.CharField(max_length=32, null=False, default='')
    class Meta(object):
        db_table = 'visitors'
        app_label = 'wechat'

    def __str__(self):
        return self.nickname


class Rate(models.Model):
    '''
    rate info
    '''
    rate_id = models.IntegerField(primary_key=True, null=False)
    bank_name = models.CharField(max_length=64, null=False, default='')
    exchange_rate = models.CharField(max_length=64, null=False, default='')
    class Meta(object):
        db_table = 'rates'
        app_label = 'wechat'

    def __str__(self):
        return self.bank_name