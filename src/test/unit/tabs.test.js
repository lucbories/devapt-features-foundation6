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
	let tabs = undefined


	it('Create plugin', () => {
		plugin = Foundation6Plugin
		expect(plugin).to.be.a('Function')
		expect(factory).to.be.a('Function')
		// expect(plugin.is_rendering_plugin).equal(true)
		
		tabs = plugin.find_rendering_function('tabs')
		
		expect(tabs).to.be.a('function')
	} )


	it('tabs(...)=>RenderingResult empty', () => {
		/*
		<div id="id1">
			<ul id="id1_titles" class="tabs" data-tabs="">
			</ul>
			<div class="tabs-content" data-tabs-content="id1_titles">
			</div>
		</div>
		*/
		const r1 = tabs({ id:'id1' }, {}, ercf, undefined)
		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		let html_content = '<div id="id1">'
		html_content += '<ul id="id1_titles" class="tabs" data-tabs=""></ul>'
		html_content += '<div class="tabs-content" data-tabs-content="id1_titles"></div>'
		html_content += '</div>'
		expect( r1.get_vtree('id1') ).to.be.an('object')
		expect( r1.get_html('id1') ).equal(html_content)
	} )


	it('tabs(...)=>RenderingResult with simple content', () => {
		/*
		<div id="id1">
			<ul id="id1_titles" class="tabs" data-tabs="">
			</ul>
			<div class="tabs-content" data-tabs-content="id1_titles">
			</div>
		</div>
		*/
		const children = {}
		const settings = {
			id:'id1',
			children:children
		}
		const state = {
			label:'',
			items:[
				{
					title:'Title 1',
					content:'Content 1'
				},
				{
					title:'Title 2',
					content:'Content 2'
				}
			],
			has_vertical:false
		}

		const r1 = tabs(settings, state, ercf, undefined)

		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		let html_content = '<div id="id1">'
		html_content += '<ul id="id1_titles" class="tabs" data-tabs="">'
		html_content += '<li class="tabs-title is-active"><a href="#id1_content_0" aria-selected="true">Title 1</a></li>'
		html_content += '<li class="tabs-title"><a href="#id1_content_1" aria-selected="false">Title 2</a></li>'
		html_content += '</ul>'
		html_content += '<div class="tabs-content" data-tabs-content="id1_titles">'
		html_content += '<div id="id1_content_0" class="tabs-panel is-active">'
		html_content += 'Content 1'
		html_content += '</div>'
		html_content += '<div id="id1_content_1" class="tabs-panel">'
		html_content += 'Content 2'
		html_content += '</div>'
		html_content += '</div>'
		html_content += '</div>'
		expect( r1.get_vtree('id1') ).to.be.an('object')
		expect( r1.get_html('id1') ).equal(html_content)
	} )


	it('tabs(...)=>RenderingResult with factory content', () => {
		/*
		<div id="id1">
			<ul id="id1_titles" class="tabs" data-tabs="">
			</ul>
			<div class="tabs-content" data-tabs-content="id1_titles">
			</div>
		</div>
		*/
		const settings1 = { id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }
		const state1 = { default:456, placeholder:'hello!!' }
		const html1 = '<input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" />'
		const input1 = {type:'input', state:state1, settings:settings1}
		input1.toString = ()=>html1

		const headers = [
			['a', 'b']
		]
		const footers = [
			['fa', 'fb']
		]
		const rows = [
			['a1', input1],
			['a2', 'b2']
		]
		const td_fn = (cell)=>'<td>' + cell.toString() + '</td>'
		const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
		const tbody_content = rows.map(tr_fn).join('')
		const content1_html = '<thead><tr><th>my table</th></tr><tr><th>a</th><th>b</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot><tr><th>fa</th><th>fb</th></tr></tfoot>'
		const content1_settings = { style:{ border:'3px', color:'red' }, class:'class1 class2' }
		const content1_state = { label:'my table', items:rows, columns:headers, footers:footers }

		const children = {}
		const settings = {
			id:'id1',
			children:children
		}
		const state = {
			label:'',
			items:[
				{
					title:'Title 1',
					content:'Content 1'
				},
				{
					title:'Title 2',
					content:{
						type:'table',
						settings:content1_settings,
						state:content1_state
					}
				}
			],
			has_vertical:false
		}

		const r1 = tabs(settings, state, ercf, undefined)

		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		let html_content = '<div id="id1">'
		html_content += '<ul id="id1_titles" class="tabs" data-tabs="">'
		html_content += '<li class="tabs-title is-active"><a href="#id1_content_0" aria-selected="true">Title 1</a></li>'
		html_content += '<li class="tabs-title"><a href="#id1_content_1" aria-selected="false">Title 2</a></li>'
		html_content += '</ul>'
		html_content += '<div class="tabs-content" data-tabs-content="id1_titles">'
		html_content += '<div id="id1_content_0" class="tabs-panel is-active">'
		html_content += 'Content 1'
		html_content += '</div>'
		html_content += '<div id="id1_content_1" class="tabs-panel">'
		html_content += '<table style="border:3px;color:red;" id="tag_9" class="class1 class2">' + content1_html + '</table>'
		html_content += '</div>'
		html_content += '</div>'
		html_content += '</div>'
		expect( r1.get_vtree('id1') ).to.be.an('object')
		expect( r1.get_html('id1') ).equal(html_content)
	} )
} )
