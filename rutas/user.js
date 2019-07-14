'use strict'

import { Router } from 'express';
import { api as _api, guardar } from '../controladores/usuario';

var api = Router();

api.get('/usuario', _api);
api.post('/registrar',guardar);

export default api;