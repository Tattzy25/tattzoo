## Brief overview
This rule establishes the mandatory use of Model Context Protocol (MCP) tools for all development tasks. These tools provide essential capabilities for file operations, web interaction, data processing, and AI-powered assistance that must be utilized instead of basic alternatives.

## MCP Tools Priority
- **Always use MCP tools** over shell commands for file operations (read_file, write_file, edit_file)
- **Leverage browser tools** for web application debugging and testing (getConsoleLogs, runPerformanceAudit, etc.)
- **Utilize search tools** for comprehensive research and data gathering (tavily-search, tavily-extract)
- **Apply chart generation** for data visualization and analysis needs
- **Reserve AI tools** for multimedia content creation when required

## Development Workflow
- **Filesystem operations**: Use read_file, write_file, edit_file instead of terminal commands
- **Web debugging**: Employ browser tools for console logs, network monitoring, and audits
- **Research tasks**: Apply Tavily search tools for web intelligence and content extraction
- **Data visualization**: Utilize chart generation tools for statistical and interactive charts
- **Version control**: Leverage GitHub tools for repository management and collaboration

## Error Handling & Best Practices
- **Verify availability**: Check MCP server connections before tool usage
- **Cost awareness**: Be mindful of API costs for AI generation tools
- **Security considerations**: Exercise caution with file operations and external API calls
- **Fallback gracefully**: Provide clear error messages when MCP tools are unavailable

## Tool Categories
- **Filesystem Server**: Core file operations, directory management, and utilities
- **Sequential Thinking**: Advanced problem-solving with thought chaining and branching
- **Browser Tools**: Debugging, monitoring, auditing, and development modes
- **Tavily Search**: Web intelligence, content extraction, and site mapping
- **GitHub Tools**: Repository management, issue/PR handling, and collaboration
- **Memory/Knowledge Graph**: Graph construction, maintenance, and querying
- **Docker Tools**: Container operations and command execution
- **Chart Generation**: Statistical charts, diagrams, maps, and interactive elements
- **MiniMax AI**: Audio generation, video/image creation, and music composition
