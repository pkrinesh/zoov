import { EqualityChecker, StateSelector } from 'zustand';
import { extendActions, extendMethods, extendComputed, buildModule, extendMiddleware } from './builders';
import { defineProvider, useScopeContext } from './context';
import type { ActionsRecord, ComputedRecord, HooksModule, MethodBuilder, MethodBuilderFn, ModuleFactory, RawModule, StateRecord } from './types';

function factory<State extends StateRecord>(state: State, rawModule: RawModule<any, any>): ModuleFactory<State, any, any> {
  return {
    actions: (actions) => factory(state, extendActions(actions, rawModule)),
    computed: (computed) => factory(state, extendComputed(computed, rawModule)),
    methods: (methods: MethodBuilderFn<State, any> | MethodBuilder) => factory(state, extendMethods(methods, rawModule)),
    middleware: (middleware) => factory(state, extendMiddleware(middleware, rawModule)),
    build: buildModule(state, rawModule),
  };
}

function defineModule<State extends StateRecord>(defaultState: State): ModuleFactory<State> {
  return factory(defaultState, {
    reducers: {},
    computed: {},
    methodsBuilders: [],
    middlewares: [],
  });
}

// Just a shortcut of module.use
function useModule<State extends StateRecord, Actions extends ActionsRecord<State>, Computed extends ComputedRecord, StateResult = State>(
  module: HooksModule<State, Actions, Computed>,
  selector?: StateSelector<State, StateResult>,
  equalityFn?: EqualityChecker<StateResult>
): [StateResult, Actions, Computed] {
  return module.use(selector, equalityFn);
}

// Just a shortcut of module.useActions
function useModuleActions<State extends StateRecord, Actions extends ActionsRecord<State>>(module: HooksModule<State, Actions>) {
  return module.useActions();
}

// Just a shortcut of module.useComputed
function useModuleComputed<State extends StateRecord, Actions extends ActionsRecord<State>, Computed extends ComputedRecord>(module: HooksModule<State, Actions, Computed>) {
  return module.useComputed();
}

export { defineModule, defineProvider, useScopeContext, useModule, useModuleActions, useModuleComputed };

export const VERSION = '0.4.1';
