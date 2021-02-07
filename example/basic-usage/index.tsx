import React, { FC, memo } from 'react';
import { defineModule } from '../../src';

const CounterModule = defineModule({ count: 0 })
  .actions({
    add: (draft) => draft.count++,
    minus: (draft) => draft.count--,
  })
  .computed({
    doubled: (state) => state.count * 2,
  })
  .init();

export const BasicUsage: FC = memo(() => {
  const { count } = CounterModule.useState();
  const { add, minus } = CounterModule.useActions();
  const { doubled } = CounterModule.useComputed();

  return (
    <div>
      <h3>Basic Usage</h3>
      <p>
        count: <b style={{ marginRight: 20 }}>{count}</b> doubled: <b>{doubled}</b>
      </p>
      <button onClick={minus}>-1</button>
      <button onClick={add}>+1</button>
    </div>
  );
});
