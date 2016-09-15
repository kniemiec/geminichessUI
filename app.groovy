@Grab("org.webjars:jquery:2.0.3-1") // this will automatically fetch jquery
@Grab("org.webjars:jquery-ui:1.12.0")
@Grab("thymeleaf-spring4")

@Controller
class Application {
	@RequestMapping("/greeting")
	public String greeting(@RequestParam(value="name", required=false, defaultValue="World") String name, Model model) {
		model.addAttribute("name", name)
		return "greeting"
	}
}
