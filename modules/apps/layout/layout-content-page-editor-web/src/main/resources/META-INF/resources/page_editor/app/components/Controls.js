/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React, {useCallback, useContext, useReducer} from 'react';

import {ITEM_ACTIVATION_ORIGINS} from '../config/constants/itemActivationOrigins';
import {ITEM_TYPES} from '../config/constants/itemTypes';
import {useFromControlsId, useToControlsId} from './CollectionItemContext';

const INITIAL_STATE = {
	activationOrigin: null,
	activeItemId: null,
	activeItemType: null,
	hoveredItemId: null,
};

const HOVER_ITEM = 'HOVER_ITEM';
const SELECT_ITEM = 'SELECT_ITEM';

const ControlsContext = React.createContext([INITIAL_STATE, () => {}]);

const reducer = (state, action) => {
	const {itemId, itemType, origin, type} = action;
	let nextState = state;

	if (type === HOVER_ITEM && itemId !== nextState.hoveredItemId) {
		nextState = {
			...nextState,
			hoveredItemId: itemId,
			hoveredItemType: itemType,
		};
	}
	else if (type === SELECT_ITEM && itemId !== nextState.activeItemId) {
		nextState = {
			...nextState,
			activationOrigin: origin,
			activeItemId: itemId,
			activeItemType: itemType,
		};
	}

	return nextState;
};

const ControlsProvider = ({initialState = INITIAL_STATE, children}) => {
	const stateAndDispatch = useReducer(reducer, initialState);

	return (
		<ControlsContext.Provider value={stateAndDispatch}>
			{children}
		</ControlsContext.Provider>
	);
};

const useActivationOrigin = () => {
	const [state] = useContext(ControlsContext);

	return state.activationOrigin;
};

const useActiveItemId = () => {
	const [state] = useContext(ControlsContext);
	const fromControlsId = useFromControlsId();

	return fromControlsId(state.activeItemId);
};

const useActiveItemType = () => {
	const [state] = useContext(ControlsContext);

	return state.activeItemType;
};

const useHoveredItemId = () => {
	const [state] = useContext(ControlsContext);
	const fromControlsId = useFromControlsId();

	return fromControlsId(state.hoveredItemId);
};

const useHoveredItemType = () => {
	const [state] = useContext(ControlsContext);

	return state.hoveredItemType;
};

const useHoverItem = () => {
	const [, dispatch] = useContext(ControlsContext);
	const toControlsId = useToControlsId();

	return useCallback(
		(
			itemId,
			{itemType = ITEM_TYPES.layoutDataItem} = {
				itemType: ITEM_TYPES.layoutDataItem,
			}
		) =>
			dispatch({
				itemId: toControlsId(itemId),
				itemType,
				type: HOVER_ITEM,
			}),
		[dispatch, toControlsId]
	);
};

const useIsActive = () => {
	const [state] = useContext(ControlsContext);
	const toControlsId = useToControlsId();

	return useCallback(
		(itemId) => state.activeItemId === toControlsId(itemId),
		[state.activeItemId, toControlsId]
	);
};

const useIsHovered = () => {
	const [state] = useContext(ControlsContext);
	const toControlsId = useToControlsId();

	return useCallback(
		(itemId) => state.hoveredItemId === toControlsId(itemId),
		[state.hoveredItemId, toControlsId]
	);
};

const useSelectItem = () => {
	const [, dispatch] = useContext(ControlsContext);
	const toControlsId = useToControlsId();

	return useCallback(
		(
			itemId,
			{
				itemType = ITEM_TYPES.layoutDataItem,
				origin = ITEM_ACTIVATION_ORIGINS.pageEditor,
			} = {
				itemType: ITEM_TYPES.layoutDataItem,
			}
		) =>
			dispatch({
				itemId: toControlsId(itemId),
				itemType,
				origin,
				type: SELECT_ITEM,
			}),
		[dispatch, toControlsId]
	);
};

export {
	ControlsProvider,
	reducer,
	useActivationOrigin,
	useActiveItemId,
	useActiveItemType,
	useHoveredItemId,
	useHoveredItemType,
	useHoverItem,
	useIsActive,
	useIsHovered,
	useSelectItem,
};
