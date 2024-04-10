import React, {FC, ComponentType} from 'react'
import {routeContext} from '../context'
import {RouteContext} from '../types'

function withRoute<P>(BaseComponent: ComponentType<P & RouteContext>): FC<P> {
    return function withRoute(props) {
        return (
            <routeContext.Consumer>
                {routeContext => <BaseComponent {...props} {...routeContext} />}
            </routeContext.Consumer>
        )
    }
}

export default withRoute
