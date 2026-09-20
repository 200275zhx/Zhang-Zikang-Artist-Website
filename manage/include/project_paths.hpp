// Shared path resolution for the manage/ content tools.
//
// Replaces the per-tool hardcoded absolute paths (which pinned the tools to
// one machine) with a root derived from the executable's own location:
//   <root>/manage/bin/update_x.exe  ->  <root>
//
// Falls back to walking up from the current directory when argv[0] does not
// resolve, so the tools work whether they are launched from manage/bin, from
// manage/, or from the project root.

#pragma once

#include <filesystem>
#include <stdexcept>
#include <string>

namespace manage {

namespace fs = std::filesystem;

// A directory is the project root if it holds the data the tools write into.
inline bool looksLikeProjectRoot(const fs::path& p) {
    std::error_code ec;
    return fs::exists(p / "src" / "app" / "data", ec)
        && fs::exists(p / "manage" / "input", ec);
}

inline fs::path projectRoot(const char* argv0) {
    std::error_code ec;

    // Preferred: derive from the executable path (manage/bin/x.exe -> root).
    if (argv0 && *argv0) {
        fs::path exe = fs::weakly_canonical(fs::path(argv0), ec);
        if (!ec) {
            for (fs::path d = exe.parent_path(); !d.empty(); d = d.parent_path()) {
                if (looksLikeProjectRoot(d)) return d;
                if (d == d.root_path()) break;
            }
        }
    }

    // Fallback: walk up from the current working directory.
    fs::path cwd = fs::current_path(ec);
    if (!ec) {
        for (fs::path d = cwd; !d.empty(); d = d.parent_path()) {
            if (looksLikeProjectRoot(d)) return d;
            if (d == d.root_path()) break;
        }
    }

    throw std::runtime_error(
        "Cannot locate the project root. Run the tool from inside the "
        "repository (for example manage/bin/update_x.exe).");
}

} // namespace manage
