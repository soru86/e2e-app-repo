package com.aidemo.service;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class CodeSourceService {

    @Value("${app.upload.temp-dir}")
    private String tempDir;

    @Value("${app.github.timeout}")
    private long githubTimeout;

    public Path processZipUpload(MultipartFile zipFile) throws IOException {
        String extractionId = UUID.randomUUID().toString();
        Path extractionPath = Paths.get(tempDir, extractionId);
        Files.createDirectories(extractionPath);

        // Use Apache Commons Compress for better ZIP file handling
        // This handles various ZIP formats and compression methods more robustly
        try (InputStream inputStream = zipFile.getInputStream();
             ZipArchiveInputStream zipInputStream = new ZipArchiveInputStream(inputStream, "UTF-8", false, true)) {
            
            ZipArchiveEntry entry;
            while ((entry = zipInputStream.getNextZipEntry()) != null) {
                String entryName = entry.getName();
                
                // Security: Prevent zip slip vulnerability
                Path filePath = extractionPath.resolve(entryName).normalize();
                if (!filePath.startsWith(extractionPath.normalize())) {
                    throw new IOException("Invalid entry path: " + entryName);
                }
                
                if (entry.isDirectory()) {
                    Files.createDirectories(filePath);
                } else {
                    // Ensure parent directories exist
                    if (filePath.getParent() != null) {
                        Files.createDirectories(filePath.getParent());
                    }
                    
                    // Write file content
                    try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                        byte[] buffer = new byte[8192];
                        int len;
                        while ((len = zipInputStream.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
            }
        }

        return extractionPath;
    }

    public Path processGitHubUrl(String githubUrl) throws IOException, GitAPIException {
        String cloneId = UUID.randomUUID().toString();
        Path clonePath = Paths.get(tempDir, cloneId);
        Files.createDirectories(clonePath);

        // Clone the repository
        Git.cloneRepository()
                .setURI(githubUrl)
                .setDirectory(clonePath.toFile())
                .setTimeout((int) (githubTimeout / 1000))
                .call();

        return clonePath;
    }

    public void cleanupTempDirectory(Path path) {
        try {
            if (path != null && Files.exists(path)) {
                deleteDirectory(path.toFile());
            }
        } catch (Exception e) {
            // Log error but don't throw
            System.err.println("Error cleaning up temp directory: " + e.getMessage());
        }
    }

    private void deleteDirectory(File directory) {
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                }
            }
            directory.delete();
        }
    }
}

