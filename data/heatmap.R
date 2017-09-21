getwd()
setwd("D:/pages/beneficiaries/data")
library(readr)
library(stringr)
library(dplyr)
library(ggplot2)
library(wesanderson)
library(RColorBrewer)
file <- "heatmap_data.csv"


doc <- read.table(file, sep = ",", header = TRUE, encoding = "UTF-8")


doc$colors <- cut(doc$presentation,breaks = 
                  c(min(doc$presentation), -10, -5, -3, 0, 3, 5, 10, 15, 40),
                  right = FALSE)

p <- ggplot(doc, aes(x = party, y = bussinessman )) + 
  geom_tile(aes(fill = colors), colour = "white") +
  scale_fill_brewer(palette = "BrBG") +
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank(),
        legend.position="bottom",
        legend.key.height = unit(0.4, "cm"),
        legend.key.width = unit(1, "cm"),
        axis.text.x = 
          element_text(angle=45, 
          hjust = 1,vjust=1,size = 8))
  
ggsave("heatmap.svg", plot = p,  
       path = "D:/pages/beneficiaries/img", 
       dpi = 300, limitsize = FALSE)
  