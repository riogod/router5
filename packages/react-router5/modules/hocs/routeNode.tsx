import React, {FC, ComponentType} from 'react'
import {RouteContext} from '../types'
import RouteNode from '../render/RouteNode'

function routeNode<P>(nodeName: string) {
    return function (BaseComponent: ComponentType<P & RouteContext>): FC<P> {
        function RouteNodeWrapper(props: P) {
            return (
                <RouteNode nodeName={nodeName}>
                    {routeContext => (
                        <BaseComponent {...props} {...routeContext} />
                    )}
                </RouteNode>
            )
        }

        return RouteNodeWrapper
    }
}

export default routeNode
