import RouteNode from 'route-node'

let nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        ids.push(ids.length ? ids[ids.length - 1] + '.' + name : name)
        return ids
    }, [])
}

let areStatesEqual = (state1, state2) => {
    return state1.name === state2.name &&
           Object.keys(state1.params).length === Object.keys(state2.params).length &&
           Object.keys(state1.params).every(p => state1.params[p] === state2.params[p])
}

export default class Router5 {
    constructor(routes, dft) {
        this.callbacks = {}
        this.lastStateAttempt = null
        this.lastKnownState = null
        this.rootNode  = routes instanceof RouteNode ? routes : new RouteNode('', '', routes)
        this.activeComponents = {}

        window.addEventListener('popstate', evt => {
            if (evt.state) return
            this.lastStateAttempt = evt.state
            this._invokeCallbacks(evt.state, this.lastKnownState)
            this.lastKnownState = evt.state
        })
    }

    _invokeCallbacks(name, newState, oldState) {
        if (!this.callbacks[name]) return
        this.callbacks[name].forEach(cb => {
            cb.call(this, newState, oldState)
        })
    }

    registerComponent(name, component) {
        if (this.activeComponents[name]) console.warn(`A component was alread registered for route node ${name}.`)
        this.activeComponents[name] = component
    }

    deregisterComponent(name) {
        delete this.activeComponents[name]
    }

    addNodeListener(name, cb) {
        if (name) {
            let segments = this.rootNode.getSegmentsByName(name)
            if (!segments.length) console.warn(`No route found for ${name}, listener could be never called!`)
        }
        if (!this.callbacks[name]) this.callbacks[name] = []
        this.callbacks[name].push(cb)
    }

    removeNodeListener(name, cb) {
        if (!this.callbacks[name]) return
        this.callbacks[name] = this.callbacks[name].filter(callback => callback !== cb)
    }

    addListener(cb) {
        this.addNodeListener('', cb)
    }

    removeListener(cb) {
        this.removeNodeListener('', cb)
    }

    buildPath(route, params) {
        return this.rootNode.buildPath(route, params)
    }

    navigate(name, params = {}, opts = {}) {
        let currentState = window.history.state
        // let segments = this.rootNode.getSegmentsByName(name)
        // let path  = this.rootNode.buildPathFromSegments(segments, params)
        let path  = this.rootNode.buildPath(name, params)

        if (!path) throw new Error(`Could not find route "${name}"`)

        this.lastStateAttempt = {name, path, params}
        let sameStates = this.lastKnownState ? areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) return
        // Push to history
        if (!sameStates) {
            window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', path)
        }

        if (this.lastKnownState && !sameStates) {
            let i
            // Diff segments
            let segmentIds = nameToIDs(name)
            let activeSegmentIds = nameToIDs(this.lastKnownState.name)
            let maxI = Math.min(segmentIds.length, activeSegmentIds.length)
            for (i = 0; i < maxI; i += 1) {
                if (activeSegmentIds[i] !== segmentIds[i]) break
            }
            let segmentsToDeactivate = activeSegmentIds.slice(i)
            console.info("to deactivate: ", segmentsToDeactivate)
            // Invoke listeners on top node to rerender (if not root node)
            if (i > 0) {
                console.info("top rerender on: ", activeSegmentIds[i - 1])
                this._invokeCallbacks(activeSegmentIds[i - 1], this.lastStateAttempt, this.lastKnownState)
            } else {
                console.info("top rerender on root")
            }
        }

        this._invokeCallbacks('', this.lastStateAttempt, this.lastKnownState)
        // Update lastKnowState
        this.lastKnownState = this.lastStateAttempt
    }
}
