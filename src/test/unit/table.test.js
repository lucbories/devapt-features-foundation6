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
	let table = undefined


	it('Create plugin', () => {
		plugin = Foundation6Plugin
		expect(plugin).to.be.a('Function')
		expect(factory).to.be.a('Function')
		// expect(plugin.is_rendering_plugin).equal(true)
		
		table = plugin.find_rendering_function('table')
		
		expect(table).to.be.a('function')
	} )


	it('table(...)=>RenderingResult with factory and sub rendering', () => {
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
		const table_content = '<thead><tr><th>my table</th></tr><tr><th>a</th><th>b</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot><tr><th>fa</th><th>fb</th></tr></tfoot>'

		const r3 = table({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { label:'my table', items:rows, columns:headers, footers:footers }, ercf, undefined)
		expect(r3).to.be.an('object')
		expect(r3.is_rendering_result).equal(true)

		expect(r3.body_scripts_urls.length).equal(body_scripts_urls.length)
		expect(r3.body_scripts_urls[0]).equal(body_scripts_urls[0])
		expect(r3.body_scripts_urls[1]).equal(body_scripts_urls[1])

		expect(r3.head_styles_urls.length).equal(head_styles_urls.length)
		expect(r3.head_styles_urls[0]).equal(head_styles_urls[0])

		expect( r3.get_vtree('id1') ).to.be.an('object')
		expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
	} )
} )