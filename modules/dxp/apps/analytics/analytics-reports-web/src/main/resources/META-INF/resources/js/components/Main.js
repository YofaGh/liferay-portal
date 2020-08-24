/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import PropTypes from 'prop-types';
import React from 'react';

import BasicInformation from './BasicInformation';
import Chart from './Chart';
import TotalCount from './TotalCount';
import TrafficSources from './TrafficSources';
import Translation from './Translation';

export default function Main({
	author,
	chartDataProviders,
	languageTag,
	onSelectedLanguageClick,
	onTrafficSourceClick,
	pagePublishDate,
	pageTitle,
	timeRange,
	timeSpanKey,
	timeSpanOptions,
	totalReadsDataProvider,
	totalViewsDataProvider,
	trafficSources,
	viewURLs,
}) {
	return (
		<div className="c-p-3">
			<BasicInformation
				author={author}
				languageTag={languageTag}
				publishDate={pagePublishDate}
				title={pageTitle}
			/>

			<div className="mt-4">
				<Translation
					defaultLanguage={languageTag}
					onSelectedLanguageClick={onSelectedLanguageClick}
					publishDate={pagePublishDate}
					timeSpanKey={timeSpanKey}
					viewURLs={viewURLs}
				/>
			</div>

			<h5 className="mt-3 sheet-subtitle">
				{Liferay.Language.get('engagement')}
			</h5>

			<TotalCount
				className="mb-2"
				dataProvider={totalViewsDataProvider}
				label={Liferay.Util.sub(Liferay.Language.get('total-views'))}
				languageTag={languageTag}
				popoverHeader={Liferay.Language.get('total-views')}
				popoverMessage={Liferay.Language.get(
					'this-number-refers-to-the-total-number-of-views-since-the-content-was-published'
				)}
			/>

			<TotalCount
				dataProvider={totalReadsDataProvider}
				label={Liferay.Util.sub(Liferay.Language.get('total-reads'))}
				languageTag={languageTag}
				popoverHeader={Liferay.Language.get('total-reads')}
				popoverMessage={Liferay.Language.get(
					'this-number-refers-to-the-total-number-of-reads-since-the-content-was-published'
				)}
			/>

			<Chart
				dataProviders={chartDataProviders}
				languageTag={languageTag}
				publishDate={pagePublishDate}
				timeRange={timeRange}
				timeSpanKey={timeSpanKey}
				timeSpanOptions={timeSpanOptions}
			/>

			{trafficSources.length > 0 && (
				<TrafficSources
					languageTag={languageTag}
					onTrafficSourceClick={onTrafficSourceClick}
					trafficSources={trafficSources}
				/>
			)}
		</div>
	);
}

Main.proptypes = {
	author: PropTypes.object.isRequired,
	chartDataProviders: PropTypes.arrayOf(PropTypes.func.isRequired).isRequired,
	languageTag: PropTypes.string.isRequired,
	onSelectedLanguageClick: PropTypes.func.isRequired,
	onTrafficSourceClick: PropTypes.func.isRequired,
	pagePublishDate: PropTypes.string.isRequired,
	pageTitle: PropTypes.string.isRequired,
	timeRange: PropTypes.object.isRequired,
	timeSpanKey: PropTypes.string.isRequired,
	timeSpanOptions: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string,
			label: PropTypes.string,
		})
	).isRequired,
	totalReadsDataProvider: PropTypes.func.isRequired,
	totalViewsDataProvider: PropTypes.func.isRequired,
	trafficSources: PropTypes.array.isRequired,
	viewURLs: PropTypes.arrayOf(
		PropTypes.shape({
			default: PropTypes.bool.isRequired,
			languageId: PropTypes.string.isRequired,
			selected: PropTypes.bool.isRequired,
			viewURL: PropTypes.string.isRequired,
		})
	).isRequired,
};
