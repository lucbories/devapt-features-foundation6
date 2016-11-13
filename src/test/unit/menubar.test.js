// NPM IMPORTS
import chai from 'chai'
const expect = chai.expect
import Devapt from 'devapt'

// COMMON IMPORTS
import Foundation6Plugin from '../../index'
const DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
const factory = DefaultRenderingPlugin.find_rendering_function('rendering_factory')
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')



describe('Foundation 6 rendering', () => {
	const erc = {
		topology_defined_application:undefined,
		credentials:undefined,
		rendering_factory:undefined,
		trace_fn: ()=>{} //console.log
	}

	const ercf = {
		topology_defined_application:undefined,
		credentials:undefined,
		rendering_factory:factory,
		trace_fn: ()=>{} //console.log
	}

	const plugin_name = 'Foundation-6' 

	const body_scripts_urls = [
		'plugins/' + plugin_name + '/jquery.min.js',
		'plugins/' + plugin_name + '/foundation.js'
	]
	const head_styles_urls = ['plugins/' + plugin_name + '/foundation.min.css']

	let plugin = undefined
	let menubar = undefined


	it('Create plugin', () => {
		plugin = Foundation6Plugin
		expect(plugin).to.be.a('Function')
		expect(factory).to.be.a('Function')
		// expect(plugin.is_rendering_plugin).equal(true)
		
		menubar = plugin.find_rendering_function('menubar')
		
		expect(menubar).to.be.a('function')
	} )


	it('menubar(...)=>RenderingResult empty', () => {			
		/*
		<div style="border:3px;" id="id1" class="class1">
			<nav style="border:3px;" class="class1">
				<div class="top-bar-title">
					<ul class="dropdown menu">
						<li role="menuitem"><strong>Devtools</strong></li>
					</ul>
				</div>
				<div class="top-bar-left">
					<ul class="dropdown menu" data-dropdown-menu=""></ul>
				</div>
				<div class="top-bar-right">
					<ul class="dropdown menu" data-dropdown-menu=""></ul>
				</div>
			</nav>
		</div>
		*/
		const r1 = menubar({ id:'id1' }, {}, ercf, undefined)
		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		const empty_menubar = '<div id="id1"><nav><div class="top-bar-title"><ul class="dropdown menu"><li role="menuitem"><strong></strong></li></ul></div><div class="top-bar-left"><ul class="dropdown menu" data-dropdown-menu=""></ul></div><div class="top-bar-right"><ul class="dropdown menu" data-dropdown-menu=""></ul></div></nav></div>'
		expect( r1.get_vtree('id1') ).to.be.an('object')
		expect( r1.get_html('id1') ).equal(empty_menubar)
	} )


	it('menubar(...)=>RenderingResult left menu, deep=1', () => {
		/*
		<div style="border:3px;" id="id1" class="class1">
			<nav style="border:3px;" class="class1">
				<div class="top-bar-title">
					<ul class="dropdown menu">
						<li role="menuitem"><strong>Devtools</strong></li>
					</ul>
				</div>
				<div class="top-bar-left">
					<ul class="dropdown menu" data-dropdown-menu="">
						<li role="menuitem">
							<div><a id="tag_2" href="#">Menu 1</a></div>
						</li>
						<li role="menuitem">
							<div><a id="tag_3" href="#">Menu 2</a></div>
						</li>
						<li role="menuitem">
							<div><a id="tag_4" class="devapt-command" href="#" devapt-command="command 3">Menu 3</a></div>
						</li>
						<li role="menuitem">
							<div><a id="tag_5" href="#">Menu 4</a></div>
						</li>
					</ul>
				</div>
				<div class="top-bar-right">
					<ul class="dropdown menu" data-dropdown-menu=""></ul>
				</div>
			</nav>
		</div>
		*/
		const menubar_settings = { id:'id1', type:'button', style:{ border:'3px' }, class:'class1' }
		const menubar_state = {
			"label":"Devtools",
			"items":[
				'Menu 1',
				{ label:'Menu 2' },
				{ label:'Menu 3', command:'command 3' },
				{
					"label":"Menu 4",
					"items":[]
				}
			]
		}
		const r2 = menubar(menubar_settings, menubar_state, ercf, undefined)
		expect(r2).to.be.an('object')
		expect(r2.is_rendering_result).equal(true)

		let filled_menubar = '<div style="border:3px;" id="id1" class="class1"><nav style="border:3px;" class="class1">'
		filled_menubar += '<div class="top-bar-title"><ul class="dropdown menu"><li role="menuitem"><strong>Devtools</strong></li></ul></div>'
		filled_menubar += '<div class="top-bar-left"><ul class="dropdown menu" data-dropdown-menu="">'
		filled_menubar += '<li role="menuitem"><a href="#">Menu 1</a></li>'
		filled_menubar += '<li role="menuitem"><a href="#">Menu 2</a></li>'
		filled_menubar += '<li role="menuitem"><a id="tag_2" class="devapt-command" href="#" data-devapt-command="command 3">Menu 3</a></li>'
		filled_menubar += '<li role="menuitem"><a href="#">Menu 4</a></li>'
		filled_menubar += '</ul></div>'
		filled_menubar += '<div class="top-bar-right"><ul class="dropdown menu" data-dropdown-menu=""></ul></div>'
		filled_menubar += '</nav></div>'
		expect( r2.get_vtree('id1') ).to.be.an('object')
		expect( r2.get_html('id1') ).equal(filled_menubar)
	} )


	it('menubar(...)=>RenderingResult left right menu, deep=1', () => {
		/*
		<div style="border:3px;" id="id1" class="class1">
			<nav style="border:3px;" class="class1">
				<div class="top-bar-title">
					<ul class="dropdown menu">
						<li role="menuitem"><strong>Devtools</strong></li>
					</ul>
				</div>
				<div class="top-bar-left">
					<ul class="dropdown menu" data-dropdown-menu="">
						<li role="menuitem">
							<div><a id="tag_2" href="#">Menu 1</a></div>
						</li>
						<li role="menuitem">
							<div><a id="tag_3" href="#">Menu 2</a></div>
						</li>
					</ul>
				</div>
				<div class="top-bar-right">
					<ul class="dropdown menu" data-dropdown-menu="">
						<li role="menuitem">
							<div><a id="tag_4" class="devapt-command" href="#" devapt-command="command 3">Menu 3</a></div>
						</li>
						<li role="menuitem">
							<div><a id="tag_5" href="#">Menu 4</a></div>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		*/
		const menubar_settings = { id:'id1', type:'button', style:{ border:'3px' }, class:'class1' }
		const menubar_state = {
			"label":"Devtools",
			"items":[
				'Menu 1',
				{ label:'Menu 2', position:"left", },
				{ label:'Menu 3', command:'command 3', position:"right" },
				{
					"label":"Menu 4",
					position:"right",
					"items":[]
				}
			]
		}
		const r2 = menubar(menubar_settings, menubar_state, ercf, undefined)
		expect(r2).to.be.an('object')
		expect(r2.is_rendering_result).equal(true)

		let filled_menubar = '<div style="border:3px;" id="id1" class="class1"><nav style="border:3px;" class="class1">'
		filled_menubar += '<div class="top-bar-title"><ul class="dropdown menu"><li role="menuitem"><strong>Devtools</strong></li></ul></div>'
		filled_menubar += '<div class="top-bar-left"><ul class="dropdown menu" data-dropdown-menu="">'
		filled_menubar += '<li role="menuitem"><a href="#">Menu 1</a></li>'
		filled_menubar += '<li role="menuitem"><a href="#">Menu 2</a></li>'
		filled_menubar += '</ul></div>'
		filled_menubar += '<div class="top-bar-right"><ul class="dropdown menu" data-dropdown-menu="">'
		filled_menubar += '<li role="menuitem"><a id="tag_3" class="devapt-command" href="#" data-devapt-command="command 3">Menu 3</a></li>'
		filled_menubar += '<li role="menuitem"><a href="#">Menu 4</a></li>'
		filled_menubar += '</ul></div>'
		filled_menubar += '</nav></div>'
		expect( r2.get_vtree('id1') ).to.be.an('object')
		expect( r2.get_html('id1') ).equal(filled_menubar)
	} )


	it('menubar(...)=>RenderingResult left menu, deep>1', () => {
		// ercf.trace_fn = console.log
		/*
		<div style="border:3px;" id="id1" class="class1">
			<nav style="border:3px;" class="class1">
				<div class="top-bar-title">
					<ul class="dropdown menu">
						<li role="menuitem"><strong>Devtools</strong></li>
					</ul>
				</div>
				<div class="top-bar-left">
					<ul class="dropdown menu" data-dropdown-menu="">
						<li role="menuitem">
							<div><a id="tag_2" href="#">Runtime</a></div>
							<ul class="submenu menu vertical" data-submenu>
						</li>
					</ul>
				</div>
				<div class="top-bar-right">
					<ul class="dropdown menu" data-dropdown-menu=""></ul>
				</div>
			</nav>
		</div>
		*/
		const menubar_settings = { id:'id1', type:'button', style:{ border:'3px' }, class:'class1' }
		const menubar_state = {
			"label":"Devtools",
			"items":[
				'Menu 1',
				{ label:'Menu 2' },
				{ label:'Menu 3', command:'command 3' },
				{
					"label":"Menu 4",
					"items":[
						{ "command":"display_logs", "label":"Logs" },
						{ "command":"display_logical_topology", "label":"Logical Topology" },
						{
							"label":"Monitor",
							"items":[
								{ command:"display_messages", label:"Messages" },
								{ command:"display_metrics", label:"Metrics" }/*,
								{
									label:"Sub Monitor",
									items:[
										{ command:"display_sub_messages", label:"Sub Messages" }
									]
								}*/
							]
						}
					]
				}
			]
		}
		const r2 = menubar(menubar_settings, menubar_state, ercf, undefined)
		expect(r2).to.be.an('object')
		expect(r2.is_rendering_result).equal(true)

		let filled_menubar = '<div style="border:3px;" id="id1" class="class1"><nav style="border:3px;" class="class1">'
		filled_menubar += '<div class="top-bar-title"><ul class="dropdown menu"><li role="menuitem"><strong>Devtools</strong></li></ul></div>'
		filled_menubar += '<div class="top-bar-left"><ul class="dropdown menu" data-dropdown-menu="">'
			filled_menubar += '<li role="menuitem"><a href="#">Menu 1</a></li>'
			filled_menubar += '<li role="menuitem"><a href="#">Menu 2</a></li>'
			filled_menubar += '<li role="menuitem"><a id="tag_4" class="devapt-command" href="#" data-devapt-command="command 3">Menu 3</a></li>'
			filled_menubar += '<li role="menuitem"><a href="#">Menu 4</a>'
				filled_menubar += '<ul class="dropdown menu" data-dropdown-menu="">'
				filled_menubar += '<li role="menuitem"><a id="tag_5" class="devapt-command" href="#" data-devapt-command="display_logs">Logs</a></li>'
				filled_menubar += '<li role="menuitem"><a id="tag_6" class="devapt-command" href="#" data-devapt-command="display_logical_topology">Logical Topology</a></li>'
				filled_menubar += '<li role="menuitem"><a href="#">Monitor</a>'
					filled_menubar += '<ul class="dropdown menu" data-dropdown-menu="">'
					filled_menubar += '<li role="menuitem"><a id="tag_7" class="devapt-command" href="#" data-devapt-command="display_messages">Messages</a></li>'
					filled_menubar += '<li role="menuitem"><a id="tag_8" class="devapt-command" href="#" data-devapt-command="display_metrics">Metrics</a></li>'
				filled_menubar += '</ul></li>'
			filled_menubar += '</ul></li>'
		filled_menubar += '</ul></div>'
		filled_menubar += '<div class="top-bar-right"><ul class="dropdown menu" data-dropdown-menu=""></ul></div>'
		filled_menubar += '</nav></div>'
		expect( r2.get_vtree('id1') ).to.be.an('object')
		expect( r2.get_html('id1') ).equal(filled_menubar)
	} )
} )