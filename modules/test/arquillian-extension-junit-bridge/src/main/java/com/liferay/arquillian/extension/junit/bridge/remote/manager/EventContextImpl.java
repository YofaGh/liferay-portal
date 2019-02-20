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

package com.liferay.arquillian.extension.junit.bridge.remote.manager;

import java.util.ArrayList;
import java.util.List;

import org.jboss.arquillian.core.spi.EventContext;
import org.jboss.arquillian.core.spi.Manager;
import org.jboss.arquillian.core.spi.NonManagedObserver;
import org.jboss.arquillian.core.spi.ObserverMethod;

/**
 * @author Matthew Tambara
 */
public class EventContextImpl<T> implements EventContext<T> {

	public EventContextImpl(
		Manager manager, List<ObserverMethod> observers,
		NonManagedObserver<T> nonManagedObserver, T event) {

		_manager = manager;

		_observers.addAll(observers);

		_nonManagedObserver = nonManagedObserver;
		_event = event;
	}

	@Override
	public T getEvent() {
		return _event;
	}

	@Override
	public void proceed() {
		_invokeObservers();

		_invokeNonmanagedObserver();
	}

	private void _invokeNonmanagedObserver() {
		if (_nonManagedObserver != null) {
			_manager.inject(_nonManagedObserver);
			_nonManagedObserver.fired(getEvent());
		}
	}

	private void _invokeObservers() {
		for (ObserverMethod observer : _observers) {
			observer.invoke(_manager, _event);
		}
	}

	private final T _event;
	private final Manager _manager;
	private final NonManagedObserver<T> _nonManagedObserver;
	private final List<ObserverMethod> _observers = new ArrayList<>();

}