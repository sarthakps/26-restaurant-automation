import numpy as np
import pandas as pd
import statsmodels.api as sm
from datetime import datetime
import sys
'''
#import matplotlib.pyplot as plt
import itertools
#from statsmodels.tsa.stattools import adfuller

#from statsmodels.tsa.seasonal import seasonal_decompose
#from statsmodels.tsa.stattools import acf, pacf
from statsmodels.tsa.arima_model import ARIMA
#from pylab import rcParams
#rcParams['figure.figsize'] = 18, 8
'''

import warnings
warnings.filterwarnings("ignore")

try:
    filename = sys.argv[1]
    data = pd.read_csv(filename,header=None,names=['visitors','date'])
    data['date'] = pd.to_datetime(data['date'])
    data = data.groupby([data['date'].dt.date]).sum()

    y = data['visitors']

    #fixed model parameter. Tune it as required
    p, q = [7,7]
    best_model = sm.tsa.statespace.SARIMAX(y, order=(p, 0, q)).fit(disp=-1)

    best_model.save(sys.argv[2])
    # Show model Summary
    # print(best_model.summary())
    print('Model Trained...')

except Exception as e:
    raise e


