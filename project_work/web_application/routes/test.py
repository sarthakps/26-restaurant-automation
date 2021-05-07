import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.tsa.arima_model import ARIMAResults
import matplotlib.pyplot as plt

'''
import itertools
#from statsmodels.tsa.stattools import adfuller
#from statsmodels.tsa.seasonal import seasonal_decompose
#from statsmodels.tsa.stattools import acf, pacf
from statsmodels.tsa.arima_model import ARIMA
from pylab import rcParams
rcParams['figure.figsize'] = 10, 8
'''
from datetime import datetime
from datetime import timedelta
#import warnings
#warnings.filterwarnings("ignore")
import sys
import os

try:
    
    #doplot = sys.argv[1]

    #filename = os.getcwd()+'\\datafile.csv'
    #filename = 'F:/SE_PROJECT_CHECK/Web Application/server/routes/'+'datafile.csv'

    #filename = str(os.getcwd().replace('\\','/')+'/datafile.csv')
    #filename = f'./datafile.csv'
    filename = sys.argv[1]
    data = pd.read_csv(filename,header=None,names=['visitors','date'])
    data['date'] = pd.to_datetime(data['date'])
    data = data.groupby([data['date'].dt.date]).sum()

    y = data['visitors']

    #modelPath = 'F:/SE_PROJECT_CHECK/Web Application/server/routes/'+'testmodel.pkl'
    #modelPath = os.getcwd().replace('\\','/')+'/testmodel.pkl'
    modelPath = sys.argv[2]
    best_model = ARIMAResults.load(modelPath)

    
    futuredays=int(sys.argv[3])
    last_7days_original = y[-7:]
    next_7days_predicted = best_model.predict(start=y.index[-1]+timedelta(days=1), end=y.index[-1]+timedelta(days=futuredays))
    bounds = best_model.get_forecast(steps=7).conf_int()
    next_7days_predicted_lowerbound = np.clip(bounds['lower visitors'],0,np.inf)
    next_7days_predicted_upperbound = np.clip(bounds['upper visitors'],0,np.inf)

    #doplot = True
    #print(doplot)
    #doplot=int(doplot)
    doplot=0

    if doplot==1:
        plt.plot(pd.concat([y,next_7days_predicted]),label='original')
        #plt.plot(bounds['lower visitors'])
        #plt.plot(bounds['upper visitors'])
        plt.plot(next_7days_predicted,label='predicted')
        plt.fill_between(next_7days_predicted.index,next_7days_predicted_lowerbound,next_7days_predicted_upperbound,alpha=0.25)
        plt.legend()
        plt.xlabel('Date')
        plt.ylabel('Visitors')
        plt.show()

    #print(next_7days_predicted.values)
    for i in y[-30:]:
        print(i)
    for i in next_7days_predicted:
        print(i)
except Exception as e:
    raise e
    
