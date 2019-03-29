# **data-manage-git**
## *manage your data by git-way in javascript*

### Install
```
    npm install data-manage-git -S
```

### Instance Methods
#### head
*always refers to the last commit*
#### current
*refers to the commit where you are now*
#### log
*return history commits from now*
#### get
*get a commit by hash string or a number which indicates move back or forward from CURRENT based CURRENT*
#### set
*move CURRENT*
#### reset
*move HEAD & CURRENT ( if necessary ) to the target commit. ATTENTION: COMMITS BETWEEN ORIGIN HEAD AND CURRENT HEAD WILL LOSS*
#### isDetached
*return whether CURRENT is NOT equal HEAD*

### Usage
```
    import Git from 'data-manage-git'

    let git = new Git({}, `this is first commit message`)

    git.commit({ a: 1, }, `this is second commit message`)
    // => {
    //        data: { a: 1, },
    //        hash: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //        message: 'this is second commit message',
    //        next: 'null',
    //        prev: '4e4f7f7144088b9b525179e4f8ba0cc130f8f822',
    //    }

    git.commit({ b: 2, }, `this is third commit message`)
    // => {
    //        data: { b: 2, },
    //        hash: '98bac7cd3418194cb9aca1255cd5051f34f3bb05',
    //        message: 'this is third commit message',
    //        next: 'null',
    //        prev: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //    }

    git.log()
    // => [
    //      {
    //          data: { b: 2, },
    //          hash: '98bac7cd3418194cb9aca1255cd5051f34f3bb05',
    //          message: 'this is third commit message',
    //          next: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //          prev: null,
    //      },
    //      {
    //          data: { a: 1, },
    //          hash: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //          message: 'this is second commit message',
    //          next: '4e4f7f7144088b9b525179e4f8ba0cc130f8f822',
    //          prev: '98bac7cd3418194cb9aca1255cd5051f34f3bb05',
    //      },
    //      {
    //          data: {},
    //          hash: '4e4f7f7144088b9b525179e4f8ba0cc130f8f822',
    //          message: 'this is first commit message',
    //          next: null,
    //          prev: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //      },
    //    ]

    git.get(-1)
    // => {
    //        data: { a: 1, },
    //        hash: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //        message: 'this is second commit message',
    //        next: '4e4f7f7144088b9b525179e4f8ba0cc130f8f822',
    //        prev: '98bac7cd3418194cb9aca1255cd5051f34f3bb05',
    //    }

    git.set(-1)
    // => {
    //        data: { a: 1, },
    //        hash: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //        message: 'this is second commit message',
    //        next: '4e4f7f7144088b9b525179e4f8ba0cc130f8f822',
    //        prev: '98bac7cd3418194cb9aca1255cd5051f34f3bb05',
    //    }

    git.isDetached()
    // => true

    git.head()
    // => '98bac7cd3418194cb9aca1255cd5051f34f3bb05'

    git.current()
    // => '2c3a462b395233dcfb461295d329b8ffe90ac4ba'

    git.reset(1)
    // => {
    //        data: { a: 1, },
    //        hash: '2c3a462b395233dcfb461295d329b8ffe90ac4ba',
    //        message: 'this is second commit message',
    //        next: '4e4f7f7144088b9b525179e4f8ba0cc130f8f822',
    //        prev: '98bac7cd3418194cb9aca1255cd5051f34f3bb05',
    //    }

    git.isDetached()
    // => false

    git.head()
    // => '2c3a462b395233dcfb461295d329b8ffe90ac4ba'

    git.current()
    // => '2c3a462b395233dcfb461295d329b8ffe90ac4ba'
```

### Dependences
1. #### [object-hash](https://www.npmjs.com/package/object-hash)
2. #### [lodash.clonedeep](https://www.npmjs.com/package/lodash.clonedeep)

### Todo
1. improve README.md
2. improve webpack config
3. code formatter
4. add eslint
5. add test
6. CI
7. improve performance

### License
[MIT](http://opensource.org/licenses/MIT)
