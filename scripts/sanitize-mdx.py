import os
import re

TACTICS_DIR = "/home/void999/Documents/projects/mypf/content/tactics"

def sanitize_mdx_content(content):
    # Step 1: Convert indented code blocks to fenced code blocks.
    # An indented code block consists of lines starting with 4 spaces, separated by blank lines,
    # but ONLY outside of existing fenced code blocks (lines between ``` and ```).
    lines = content.split('\n')
    new_lines = []
    
    in_block = False
    block_lines = []
    in_fenced_block = False
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Track if we are inside a fenced code block
        if line.strip().startswith('```'):
            in_fenced_block = not in_fenced_block
            if in_block:
                # Flush the indented block if we hit a fenced block (safety)
                while block_lines and not block_lines[-1].strip():
                    block_lines.pop()
                while block_lines and not block_lines[0].strip():
                    block_lines.pop(0)
                new_lines.append("```")
                new_lines.extend(block_lines)
                new_lines.append("```")
                in_block = False
                block_lines = []
            new_lines.append(line)
            i += 1
            continue
            
        if in_fenced_block:
            # Inside a fenced block, just keep the line as is
            new_lines.append(line)
            i += 1
            continue
            
        # Check if we should start an indented block
        if not in_block:
            if line.startswith('    ') and line.strip():
                in_block = True
                block_lines = [line[4:]] # strip 4 spaces
            else:
                new_lines.append(line)
        else:
            # A block continues if the line starts with 4 spaces or is empty
            if line.startswith('    ') or not line.strip():
                if line.startswith('    '):
                    block_lines.append(line[4:])
                else:
                    block_lines.append(line)
            else:
                # Block ended. Flush it.
                while block_lines and not block_lines[-1].strip():
                    block_lines.pop()
                while block_lines and not block_lines[0].strip():
                    block_lines.pop(0)
                
                lang = "bash"
                block_text = '\n'.join(block_lines)
                if '$' not in block_text and 'C:\\' not in block_text and 'responder' not in block_text.lower() and 'nmap' not in block_text.lower():
                    lang = ""
                
                new_lines.append(f"```{lang}")
                new_lines.append(block_text)
                new_lines.append("```")
                
                in_block = False
                block_lines = []
                new_lines.append(line)
        i += 1
        
    if in_block:
        while block_lines and not block_lines[-1].strip():
            block_lines.pop()
        while block_lines and not block_lines[0].strip():
            block_lines.pop(0)
        lang = "bash"
        block_text = '\n'.join(block_lines)
        new_lines.append(f"```{lang}")
        new_lines.append(block_text)
        new_lines.append("```")
        
    content = '\n'.join(new_lines)
    
    # Step 2: Escape unclosed HTML-like tags, raw < characters, and curly braces { } in plain text.
    # To do this safely, we find text that is NOT inside code blocks (inline `code` or fenced ```code```).
    parts = re.split(r'(```.*?```|`.*?`)', content, flags=re.DOTALL)
    
    for idx in range(len(parts)):
        part = parts[idx]
        # Only process text outside of code blocks (even indices)
        if idx % 2 == 0:
            new_part = []
            i = 0
            while i < len(part):
                if part[i] == '{':
                    new_part.append('\\{')
                    i += 1
                elif part[i] == '}':
                    new_part.append('\\}')
                    i += 1
                elif part[i] == '<':
                    # Check if this matches a valid tag or comment
                    close_idx = part.find('>', i)
                    is_valid = False
                    if close_idx != -1:
                        tag_inner = part[i+1:close_idx]
                        tag_words = tag_inner.strip().split()
                        tag_name = tag_words[0].lower() if tag_words else ""
                        # Remove trailing slash for self-closing tags like <br />
                        if tag_name.endswith('/'):
                            tag_name = tag_name[:-1]
                        
                        valid_tags = [
                            'br', 'hr', 'img', 'a', '/a', 'strong', '/strong', 
                            'em', '/em', 'code', '/code', 'pre', '/pre', 'p', '/p', 
                            'div', '/div', 'span', '/span', 'li', '/li', 'ul', '/ul', 'ol', '/ol'
                        ]
                        if tag_name in valid_tags:
                            is_valid = True
                        elif tag_inner.startswith('!--') and tag_inner.endswith('--'):
                            is_valid = True
                    
                    if is_valid:
                        new_part.append(part[i:close_idx+1])
                        i = close_idx + 1
                    else:
                        new_part.append('&lt;')
                        i += 1
                else:
                    new_part.append(part[i])
                    i += 1
            parts[idx] = ''.join(new_part)
            
    return ''.join(parts)

def main():
    print("Sanitizing MDX files...")
    count = 0
    for root, dirs, files in os.walk(TACTICS_DIR):
        for file in files:
            if file.endswith('.mdx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                sanitized = sanitize_mdx_content(content)
                
                if sanitized != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(sanitized)
                    count += 1
                    print(f"  Sanitized {file}")
                    
    print(f"Sanitization complete! Sanitized {count} files.")

if __name__ == "__main__":
    main()
