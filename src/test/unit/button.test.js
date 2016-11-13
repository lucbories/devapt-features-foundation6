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
	let button = undefined


	it('Create plugin', () => {
		plugin = Foundation6Plugin
		expect(plugin).to.be.a('Function')
		expect(factory).to.be.a('Function')
		
		button = plugin.find_rendering_function('button')
		
		expect(button).to.be.a('function')
	} )


	it('button(...)=>RenderingResult', () => {
		const r1 = button({ id:'id1' }, {}, erc, undefined)
		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		expect(r1.body_scripts_urls.length).equal(body_scripts_urls.length)
		expect(r1.body_scripts_urls[0]).equal(body_scripts_urls[0])
		expect(r1.body_scripts_urls[1]).equal(body_scripts_urls[1])

		expect(r1.head_styles_urls.length).equal(head_styles_urls.length)
		expect(r1.head_styles_urls[0]).equal(head_styles_urls[0])

		expect( r1.get_vtree('id1') ).to.be.an('object')
		expect( r1.get_html('id1') ).equal('<button id="id1" type="button" class="button"></button>')
		

		const r2 = button({ id:'id1', type:'button', style:{ border:'3px' }, class:'class1' }, {}, erc, undefined)
		expect(r2).to.be.an('object')
		expect(r2.is_rendering_result).equal(true)

		expect( r2.get_vtree('id1') ).to.be.an('object')
		expect( r2.get_html('id1') ).equal('<button style="border:3px;" id="id1" type="button" class="class1 button"></button>')
		

		const r3 = button({ id:'id1', type:'submit', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:'HELLO'}, erc, undefined)
		expect(r3).to.be.an('object')
		expect(r3.is_rendering_result).equal(true)

		expect( r3.get_vtree('id1') ).to.be.an('object')
		expect( r3.get_html('id1') ).equal('<button style="border:3px;color:red;" id="id1" type="submit" class="class1 class2 button">HELLO</button>')
	} )
} )