-- Retrieves all scope options from os_scope table
SELECT id, scope_type, code 
FROM os_scope_list_organisation 
ORDER BY scope_type