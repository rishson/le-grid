import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { spy, stub, SinonSpy, SinonStub } from 'sinon';
import * as compose from '@dojo/compose/compose';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';

import createHeader from '../../src/createHeader';
import * as gridHeaderTheme from '../../src/styles/gridHeader';

let widgetBaseSpy: SinonSpy;
let getStub: SinonStub;
let isComposeFactoryStub: SinonStub;
let mockRegistry: FactoryRegistry;

registerSuite({
	name: 'createHeader',
	beforeEach() {
		widgetBaseSpy = spy(createWidgetBase);
		getStub = stub().withArgs('grid-row-view').returns(widgetBaseSpy);
		isComposeFactoryStub = stub(compose, 'isComposeFactory').returns(true);
		mockRegistry = <any> {
			get: getStub,
			has() {
				return true;
			}
		};
	},
	afterEach() {
		isComposeFactoryStub.restore();
	},
	render() {
		const onSortRequest = (columnId: string, descending: boolean): void => {};
		const properties = {
			registry: mockRegistry,
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar' }
			],
			onSortRequest
		};

		const row = createHeader({ properties });
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.deepEqual(vnode.properties!.classes, {[gridHeaderTheme.gridHeader]: true, [gridHeaderTheme.gridHeaderRow]: true});
		assert.strictEqual(vnode.properties!['role'], 'row');
		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.deepEqual(vnode.children![0].properties!.classes, {[gridHeaderTheme.gridHeaderTable]: true});
		assert.strictEqual(vnode.children![0].properties!['role'], 'presentation');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice);
		assert.deepEqual(widgetBaseSpy.getCall(0).args[0], {
			properties: { key: 'foo', id: 'foo', column: { id: 'foo', label: 'foo' }, sortDetails: undefined, onSortRequest }
		});
		assert.deepEqual(widgetBaseSpy.getCall(1).args[0], {
			properties: { key: 'bar', id: 'bar', column: { id: 'bar', label: 'bar' }, sortDetails: undefined, onSortRequest }
		});
	}
});
