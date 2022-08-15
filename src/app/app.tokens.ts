import { InjectionToken, Type } from '@angular/core';
import * as Webstomp from 'webstomp-client';

export const WEBSOCKET = new InjectionToken<Type<WebSocket>>('WebSocket', { providedIn: 'root', factory: () => WebSocket });
export const WEBSTOMP = new InjectionToken<unknown>('Webstomp', { providedIn: 'root', factory: () => Webstomp });
