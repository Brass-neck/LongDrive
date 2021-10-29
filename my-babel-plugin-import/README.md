# babel-plugin-import-demo

这是一个 `babel-plugin-import`插件的最小运行单元 demo，可以实现按需自动加载单包和样式

## Example

#### `{ "libraryName": "antd", style: true }`

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
require('antd/lib/button/style');
ReactDOM.render(<_button>xxxx</_button>);
```

### options

`options` can be object.

```javascript
{
  "libraryName": "antd",
  "libraryDirectory": "lib",
  "style": true,
}
```

#### style

`["import", { "libraryName": "antd", "style": true }]`

import js and css modularly (LESS/Sass source files)

```

```
