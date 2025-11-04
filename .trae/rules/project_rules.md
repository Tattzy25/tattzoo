# AI PROJECT CONTEXT & MCP TOOLS GUIDE

## PROJECT STATUS: PRODUCTION (LIVE DEPLOYMENT)

**CRITICAL CONTEXT:** This is not development, testing, or experimentation. This is a live production website that has been under active development for 8+ months. The application is deployed and serving real users.

## MCP TOOLS AVAILABLE & REQUIRED USAGE

### CORE DEVELOPMENT TOOLS
- **search_codebase** - Semantic search across entire codebase
- **search_by_regex** - Pattern-based search with regex
- **view_files** - View specific file contents
- **list_dir** - Directory listing and exploration
- **write_to_file** - Create new files
- **update_file** - Modify existing files
- **edit_file_fast_apply** - Quick file edits
- **rename_file** - File movement/renaming
- **delete_file** - File deletion
- **run_command** - Execute terminal commands
- **check_command_status** - Monitor command execution
- **stop_command** - Terminate running processes
- **open_preview** - Preview web applications

### MEMORY & KNOWLEDGE MANAGEMENT
- **mcp_Memory_*** - Knowledge graph entities, relations, observations
- Create and manage project knowledge consistently
- Maintain context across sessions

### UI COMPONENT MANAGEMENT (shadcn-ui)
- **mcp_shadcn-ui_*** - Component discovery, examples, and management
- Use for production-grade UI components

### DOCUMENTATION & CONTEXT
- **mcp_context7_*** - Library documentation and API references
- **mcp_Fetch_fetch** - Web content retrieval

### TESTING & QUALITY ASSURANCE
- **mcp_testsprite_*** - Test generation and execution
- **mcp_Sequential_Thinking_sequentialthinking** - Complex problem solving

### VERSION CONTROL & DEPLOYMENT
- **mcp_GitHub_*** - Repository management, file operations, issues, PRs

## PRODUCTION ENVIRONMENT RULES

1. **NO EXPERIMENTATION** - All changes must be production-ready
2. **STABILITY FIRST** - Avoid breaking existing functionality
3. **BACKWARD COMPATIBILITY** - Maintain API contracts
4. **PERFORMANCE AWARE** - Optimize for production load
5. **SECURITY CONSCIOUS** - Follow security best practices
6. **ERROR HANDLING** - Robust error handling required
7. **LOGGING** - Proper logging for production monitoring
8. **DOCUMENTATION** - Keep documentation updated

## CONSISTENT BEHAVIOR REQUIREMENTS

### ALWAYS:
- Use MCP tools for all operations
- Check existing code patterns before making changes
- Verify file paths and locations
- Test changes in context
- Maintain production readiness
- Document decisions and changes

### NEVER:
- Make assumptions about untested code
- Break existing functionality
- Introduce untested dependencies
- Skip proper error handling
- Compromise security

## PROJECT ARCHITECTURE REMINDERS

### Frontend (React + TypeScript + Vite)
- Production build system
- Live on port 3000 (dev) / deployed (production)
- AR integration with MediaPipe BlazePose
- License-based rate limiting
- Real-time AI streaming responses

### Backend (Python + FastAPI)
- PostgreSQL database with Neon integration
- AI service integration (OpenAI)
- Real-time streaming support
- Production logging and monitoring
- Database schema management

### Database (PostgreSQL)
- Multiple schema files in `backend/neon_db/`
- Production data modeling
- Complex relationships and constraints
- Migration-ready structure

## CURRENT FOCUS AREAS

1. **Database Schema Execution** - Getting schemas deployed
2. **AI Service Integration** - Production OpenAI integration
3. **AR Functionality** - Camera-based tattoo preview
4. **License Management** - Production license system
5. **Performance Optimization** - Production load handling

## TOOLS TO PRIORITIZE

1. **Database Operations** - Schema execution, data management
2. **API Development** - Backend endpoint creation
3. **UI Component Management** - Production-grade components
4. **Testing & QA** - Production test coverage
5. **Deployment Automation** - CI/CD pipeline management

## EMERGENCY PROTOCOLS

If encountering production issues:
1. Immediately assess impact
2. Check monitoring and logs
3. Rollback if necessary
4. Document incident and resolution
5. Update runbooks and procedures

---

**LAST UPDATED:** $(date)
**PROJECT AGE:** 8+ months
**STATUS:** LIVE PRODUCTION
**URGENCY:** HIGH (Real users depending on service)