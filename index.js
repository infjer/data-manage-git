import { sha1, } from 'object-hash'
import clonedeep from 'lodash.clonedeep'

const $HEAD = Symbol(`HEAD`)
const $CURRENT = Symbol(`CURRENT`)
const $hashmap = Symbol(`hashmap`)
const $getPureObject = Symbol(`getPureObject`)
const $searchByHash = Symbol(`searchByHash`)
const $go = Symbol(`go`)
const $getHistory = Symbol(`getHistory`)

class Git {
    constructor(initialValue, message = ``) {
        this[$hashmap] = this[$getPureObject]()
        // new Proxy(this[$getPureObject](), {
        //     get: (target, key, receiver) => {
        //         return clonedeep(target[key])
        //     },
        // })
        this[$HEAD] = null
        this[$CURRENT] = null
        this.commit(initialValue, message)
    }
    commit(data, message = ``) {
        let hash_obj = this[$getPureObject]()
        let _data
        if (data == null || typeof data !== `object`) {
            _data = new String(data)
        } else {
            _data = clonedeep(data)
        }
        hash_obj.random = Math.random()
        hash_obj.data = _data
        let hash = sha1(hash_obj)
        let log = this[$getPureObject]()
        if (this[$HEAD]) {
            this[$hashmap][this[$HEAD]].next = hash
        }
        log.prev = this[$HEAD]
        log.next = null
        log.message = message
        log.data = data == null || typeof data !== `object`? data : _data
        log.hash = hash
        this[$hashmap][hash] = log
        this[$HEAD] = hash
        this[$CURRENT] = hash
        return log
    }
    head() {
        return clonedeep(this[$hashmap][this[$HEAD]])
    }
    current() {
        return clonedeep(this[$hashmap][this[$CURRENT]])
    }
    isDetached() {
        return this[$HEAD] !== this[$CURRENT]
    }
    get(param) {
        if (typeof param === `string`) {
            let hash = this[$searchByHash](param)
            return clonedeep(this[$hashmap][hash])
        } else if (typeof param === `number`) {
            if (!Number.isInteger(param)) {
                throw new Error(`Invalid parameter, 1 integer required.`)
            }
            return clonedeep(this[$hashmap][this[$go](param, this[$CURRENT])])
        } else {
            throw new Error(`Invalid parameter, hash string or 1 integer required.`)
        }
    }
    set(param) {
        // move CURRENT, won't change history
        if (param === undefined) {
            // move CURRENT to HEAD
            this[$CURRENT] = this[$HEAD]
        } else if (typeof param === `string`) {
            // move CURRENT to history include hash
            this[$CURRENT] = this[$searchByHash](param)
        } else if (typeof param === `number`) {
            if (!Number.isInteger(param)) {
                throw new Error(`Invalid parameter, 1 integer required.`)
            }
            this[$CURRENT] = this[$go](param, this[$CURRENT])
        } else {
            throw new Error(`Invalid parameter, hash string or 1 integer required.`)
        }
        return clonedeep(this[$hashmap][this[$CURRENT]])
    }
    reset(param) {
        // move HEAD, commits between origin HEAD and current HEAD will loss
        if (param === undefined) {
            // move HEAD to CURRENT
            this[$HEAD] = this[$CURRENT]
        } else if (typeof param === `string`) {
            this[$HEAD] = this[$searchByHash](param)
        } else if (typeof param === `number`) {
            if (!Number.isInteger(param)) {
                throw new Error(`Invalid parameter, 1 integer required.`)
            }
            this[$HEAD] = this[$go](- Math.abs(param), this[$HEAD]) // promise to go back from HEAD
        } else {
            throw new Error(`Invalid parameter, hash string or 1 integer required.`)
        }
        let { next, } = this[$hashmap][this[$HEAD]]
        this[$hashmap][this[$HEAD]].next = null
        while (next) {
            let _next = next
            next = this[$hashmap][next].next
            delete this[$hashmap][_next]
        }
        this[$CURRENT] = this[$HEAD]
        return clonedeep(this[$hashmap][this[$HEAD]])
    }
    log(n) {
        const HISTORY_LENGTH = Object.keys(this[$hashmap]).length
        if (n == null) {
            n = HISTORY_LENGTH
        } else if (typeof n === `number`) {
            if (!Number.isInteger(n) || n <= 0) {
                throw new Error(`Invalid parameter, 1 positive integer required.`)
            } else if (n > HISTORY_LENGTH) {
                throw new Error(`Unable to get ${HISTORY_LENGTH} histories from now.`)
            }
        } else {
            throw new Error(`Invalid parameter.`)
        }
        return this[$getHistory](n)
    }
    [$getPureObject]() {
        return Object.create(null)
    }
    [$searchByHash](str) {
        let count = 0
        let hash = null
        let reg = new RegExp(`^${str}`)
        for (let key in this[$hashmap]) {
            if (reg.test(key)) {
                count++
                if (count >= 2) {
                    throw new Error(`Unable to get a unique history by ${str}.`)
                }
                hash = key
            }
        }
        if (hash === null) {
            throw new Error(`No history hash started with ${str}.`)
        }
        return hash
    }
    [$go](n, p) {
        if (n < 0) {
            do {
                let hash = this[$hashmap][p].prev
                if (hash === null) {
                    throw new Error(`No more than ${n} histories from now.`)
                }
                p = hash
                n++
            } while (n < 0)
        } else if (n > 0) {
            do {
                let hash = this[$hashmap][p].next
                if (hash === null) {
                    throw new Error(`No more than ${n} histories from now.`)
                }
                p = hash
                n--
            } while (n > 0)
        }
        return p
    }
    [$getHistory](n) {
        let history = []
        let hash = this[$HEAD]
        do {
            let log = this[$hashmap][hash]
            // log.hash = hash
            // log.message = this[$hashmap][hash].message
            // log.data = this[$hashmap][hash].data
            history.push(clonedeep(log))
            hash = this[$hashmap][hash].prev
            n--
        } while (n !== 0)
        return history
    }
}

export default Git
